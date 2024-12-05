---
title: "microCMS のエラーレスポンスはステータスコードを返さない"
category: "インフラ・サーバーサイド関連"
---

# microCMS のエラーレスポンスはステータスコードを返さない
microCMS の API からデータフェッチを実施した際に、データが存在しない場合、404エラーが返る。  
Next.js の gSP で `notFound: true;` として、404エラーの場合には404ページを表示するなど、適切なエラーハンドリングを行うよう改修を試みた。

```
const tagId = typeof params?.tagId === "string" ? params.tagId : "";

// APIからのデータ取得
const articlesByTagsResponse: ArticlesResponse = await getArticlesByTagId({
limit: LIMIT_NUMBER_OF_DISPLAYED_ARTICLES_ON_ONE_PAGE,
pageNumber,
tagId,
});

const tagIdResponse = await getTagById()(tagId);

if (articlesByTagsResponse.contents.length === 0) {
    Sentry.captureMessage(`404: Tag not found, Tag ID = ${tagId}`, "warning");
    return {
        notFound: true, // 追加
    };
}
```
上記の実装で「存在しないタグ」を呼び出した時、404エラーではなく500エラーがレスポンスされることを確認。  
これは `getTagById()` の実行時にエラーが発生していることが要因で、`getTagById()` はエラーハンドリングを実施していなかった。
```
export const getTagById = async (
  contentId: string,
  queries?: MicroCMSQueries,
): Promise<TagContents> =>
  client.get({
    contentId,
    endpoint: "tags",
    queries,
  });
```
考えるべき問題として、microCMS SDK は404エラーが発生した場合に、Promise.resolve または Promise.reject のどちらを返すのかということ。  
データが見つからなかった際に、それをエラーと判断するのが誰の役割であるのかは、状況によって変わる。  
microCMS SDK側が、「データが見つからなかった」という resolve を返すことも想定できるため、microCMS SDK のエラーハンドリングを確認する。
```
if (
    response.status !== 429 &&
    response.status >= 400 &&
    response.status < 500
) {
const message = await getMessageFromResponse(response);

return bail(
    new Error(
        `fetch API response status: ${response.status}${
            message ? `\n  message is \`${message}\`` : ''
        }`,
    ),
);
}
```
microCMS の createClient では、上記のようにエラーを処理している。  
Error を返しているので、`getTagById()` の `client.get()` では Promise.reject が返ってくることになる。  
この Error を適切にハンドリングしていないことによって、`getTagById()` でエラーが発生し、gSP で発生したエラーとしてステータスコードは500となり、`notFound: true;`の処理まで到達しない。  

以下のように改善する。  
```
export const getArticleById = async (
  contentId: string,
  queries?: MicroCMSQueries,
): Promise<ArticleContents | null> => {
  try {
    return await client.get({
      contentId,
      endpoint: "articles",
      queries,
    });
  } catch(error) {
    return convertToNullFrom404Error(error)
  }
}

export function convertToNullFrom404Error(error: unknown) {
  if (error instanceof Error && error.message.includes("status: 404")) {
    return null
  }
  return Promise.reject(error)
} 
```
microCMS 側の処理を確認した時、エラー時にはメッセージしかレスポンスしていないことが分かった。  
これによって、ステータスコードでエラーハンドリングを実施できないため、メッセージに「status: 404」が含まれるかどうかで判定を行う。  
エラーが404の場合、null を返し、それ以外の場合は Promise.reject を返すようにする。  
404エラーの場合の `getTagById()` の返り値は null であるため、以下のように `notFound: true;` としてハンドリングが行えるようになる。  
```
const tagIdResponse = await getTagById(tagId)

if (articlesByTagsResponse.contents.length === 0 || !tagIdResponse) {
    Sentry.captureMessage(`404: Tag not found, Tag ID = ${tagId}`, "warning");
    return {
        notFound: true,
    };
}
```
