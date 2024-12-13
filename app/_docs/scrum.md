---
title: "スクラム開発について"
---

スクラムの案件に携わるにあたって、スクラム開発について簡単に調べてきた。
ここではスクラム開発とは何か？どのように行われているのか？について纏めておく。


## ウォーターフォール開発とアジャイル開発
スクラムはアジャイルのフレームワークなので、アジャイルについて知る必要がある。  
アジャイルは2001年に17名のソフトウェア開発者が発表した「アジャイルソフトウェア開発宣言」から普及した開発手法である。  
当時ソフトウェア開発手法で主流となっていたウォーターフォール開発のデメリットを払拭する為に提唱され、2000年代半ば頃から徐々に普及した。

### ウォーターフォール開発のデメリット
ウォーターフォール開発では、「要件定義→設計→製造→テスト→リリース」のプロセスで開発を進める。  
前提として、前工程が完了しないと次の工程へ進まない、次の工程へ進むと前の工程には戻らない、という制約がある。  
その為、要件定義を終えた次のステップで、再度仕様を変更するといった柔軟な対応は出来ない。途中で要件を変える場合は追加費用が発生したり、全体のスケジュール調整が発生してくる。いずれも対応のコストは重く、開発者は「最初に確定した仕様」以外の対応を極力排除する思考になる。プロダクトを成功させたいクライアントと、開発作業を成功させたい開発者とではゴールの本質にズレが生じる。  
  
これらの要因によって、要件定義で定める機能は肥大化する。ここで機能の定義を取りこぼしてしまうと、その後の要求は「仕様書にありません」で片付いてしまうからだ。要件定義書は誰が見ても溜め息が出るほど分厚くなり、開発者はこの分厚い仕様書を逐一確認しながら作業を行う事になる。  
  
システム機能の利用度を調査したスタンディッシュ・グループのレポートでは、リリースされたシステム機能のうち、全く使われない機能は45%、ほとんど使われない機能は9%という結果になった。過半数の機能が使われていないという結果は、後戻り出来ないが為に肥大化した要件定義に起因する。  

そして、ウォーターフォール手法は経験の浅い開発者にとっても不向きだった。要件定義の詰めが甘く、開発チームとクライアントの中で仕様を定め切れていない場合、設計や製造の過程でそれらの問題が浮き彫りになり、どこで穴埋めするのか？という問題が発生する。これらはどのような結論であったとしても、スケジュールを圧迫し、開発者、そしてクライアントにとっても重い負担をかける。  
  
見積もりの精度も非常に難易度が高いものになる。全ての機能を定義した後に、それらの機能がどれくらいの作業で完了するのかを算出しなければならない。経験豊富な技術者であれば問題ないが、多くの場合は全ての作業に不確定要素がある。  
先の見えない真っ暗のトンネルを、どの程度歩けば潜り抜けられるのか？という問いに入口で答えなければならない。一度似たようなトンネルを潜った経験があれば、その見積もりは算出できる。しかし多くの場合は、不確定要素を含んだまま見積りを確定することになる。  

### アジャイル開発のメリット
不具合や変更が発生した際に、工程を遡るコストが重いウォーターフォール型のデメリットを解決すべくアジャイル手法が誕生する。  
システムはユーザーの需要に応え、ビジネスとして成功する事がゴールである。定義された要件をスケジュール通りに開発する事はゴールではない。  
そして需要は常に変化するので、それに応えるシステム要件も変化する。アジャイルはこれらを前提として、変更を柔軟に取り入れられる手法で開発を行う。  
アジャイル開発では、「要件定義→設計→製造→テスト→リリース」のプロセスを一つの機能単位で行い、この短いサイクルを繰り返してプロダクトの詳細度を高めていく。機能単位でレビューが行われ、機能単位でフィードバックを実施する。  
要件定義からリリースまで日が空いてしまうと、予め検討していたターゲットの需要がリリース時には変わってきていることもある。アジャイルでは短い開発サイクルで情報を更新し続けるので、需要に対して精度の高いアプローチを仕掛ける事が出来る。  
  
アジャイルを導入する理由の一つに、「市場投入までの時間の短さ」が多く挙げられている。アジャイルではシステムを機能単位に分割し、機能それぞれに優先順位をつけて作業を進めていく。その為、１から１０まで実装を行なってリリースするのではなく、「最低限この機能さえあれば価値を提供できる」というラインで市場に投入する事が出来る。当然ながら、発案から商用化までの速度は早ければ早いほど良い。細かい十分条件の機能やブラッシュアップは後のサイクルで開発を行っていく事が出来る。  

早期にユーザーに価値を提供する事で、ユーザー体験の具体的なフィードバックが見えてくる。どのような機能が必要で、何が不要なのか、何を改善すべきか、これらは予め検討して予測するよりも、ユーザーの体験から算出する方が精度が高い。  

### ウォーターフォール開発のメリット
アジャイルはウォーターフォールのデメリットを解決する為に発案されたが、ウォーターフォール開発にも明確なメリットがある。  
大規模な案件では必要な人員が多くなり、スケジュールや開発コストの管理が非常に難しくなるので、アジャイル手法で柔軟な立ち回りをしている余裕はそもそも無い。  
規模が大きいと機能要件も多くなるので、機能単位で開発を行うと煩雑になりやすく、綿密にプロセスをこなしていく方が品質の担保がしやすい。  
銀行の基幹システムのように要件が明確であり、変更が発生しづらいプロダクト開発にはウォーターフォール手法が積極的に取り入れられている。  

### アジャイル開発のデメリット
アジャイル手法では明確に要件を検討するプロセスがなく、開発→改善の繰り返しで品質を向上させていく。その為、本来の方向性や目標を見失いやすく、管理が難しいとされている。緻密なプロジェクト管理を実施しないと、目的から脱線してしまう可能性がある。変更の柔軟性によって勘違いしがちだが、方向性が明確に定まっていない状態で開発を進める事はリスクが大きい。  
また、ウォーターホールほど厳密なスケジュール管理は行われず、リリース計画が変更される事も珍しくはないので、全体のスケジュールを把握しにくい。  

## スクラム開発とは
スクラム開発はアジャイルのフレームワークの一つで、最も多く採用されている。アジャイルのフレームワークは他にもXPやカンバンなどがあるが、これらのフレームワークは複合されて利用する事が可能なので、ANDにもORにもなり得る。  
スクラムは不確定要素を多く含むプロダクトの開発に適している。5つのイベント（会議）と3つのロール（役割）、3つの作成物という最低限のルールで構成される。  

### プロダクトバックログ
機能や要件、修正対応など、プロダクトに必要な作業をリストアップし、優先度順に並べ替えたものをプロダクトバックログと呼ぶ。各項目が達成された時に得られる価値や、システム機能としての必要性、不具合の場合はそのリスク度合い等を考慮して順序を入れ替える。開発はこの優先度が上位のものから着手していく。  
プロダクトバックログは、要件の変更などに合わせて常に更新されていくが、開発着手するものは事前に見積もりが済んでいる必要がある。  

### ユーザーストーリー
プロダクトバックログの項目単位をユーザーストーリーと呼ぶ。定められた機能をただ実装するのではなく、その機能がどのような価値をもたらすのかを利用者目線で記述する。「ユーザーとして、検索機能が必要である。それはユーザーが必要な情報をスムーズに得る為だ」といったような項目名称になり、開発者はその機能の本質的な意味を理解した上で実装を行う。  

### ロール
#### プロダクトオーナー
プロダクトの責任者で、プロダクトバックログの最終決定権限を持っている。プロダクトの What を解決し、クライアントの要求とプロダクトバックログの整合性を保つ。他にも、リリース計画を定めたり、プロジェクトの予算管理を行う役割がある。

#### 開発チーム
プロダクトの実装を担当し、How を解決する。10人以下という小規模なチームでの運用が推奨されているが、現場によっては更に多いこともある。専門的な役割よりも汎用的な役割を求められ、フロントエンドやバックエンド、インフラ、検証などで作業者が分担されない。誰がどの対応をしても問題ないという機能横断的なチーム構成が求められる。当然、個々に能力の差はあるので細かい技術領域は許容するが、個人が専門的な作業に閉じない、というポリシーがある。  

#### スクラムマスター
スクラム開発が順当に進むようにコントロールする役割を担う。スクラム開発のルールやポリシーに最も精通している事が求められ、プロダクトオーナーや開発チームにスクラム手法を理解させ、正しいプロセスで開発が実施できるようにする。他にもコーチングやファシリテーション、プロダクトオーナーと開発チームとの関係を繋ぐ、といったような役割を持ち、スクラムで発生する様々な課題を解決する責任を負う。

#### スプリント
スクラムでは、最長1ヶ月までの固定期間を区切り、その期間で開発を繰り返していく。この期間をスプリントと呼ぶ。スプリント毎にゴールを設定して開発を行い、ゴール達成が出来ていなくても期間延長はせず、スプリントは終了する。

#### スプリントプランニング
スプリントで何を作るのか、どのように作るのかを計画する会議をスプリントプランニングと呼ぶ。プロダクトオーナーが方針を示し、スプリントで達成すべきプロダクトバックログの項目を選択する。選択するプロダクトバックログ項目は、事前の見積もりや開発チームの実績などから判断して増減する。

#### リファインメント
スプリントプランニングで決定するプロダクトバックログ項目には、事前に見積もりや要件検討、項目の達成基準などを定めておく必要がある。これらをプランニング前に定義する活動をリファインメント（プロダクトバックログリファインメント）と呼ぶ。

#### スプリントバックログ
スプリントで実施するプロダクトバックログ項目の具体的な作業内容を開発チームで計画する。プロダクトオーナーが示した「スプリントで達成したい項目」を、スプリント期間内に問題なく達成できそうか、無理のある目標設定ではないか、を査定する。想定よりも実装難度が高い場合は、このタイミングで検知してプロダクトオーナーに進言しておく必要がある。

#### インクリメント
これまでの作業と今回のスプリントで完了した項目を合わせ、正常に動作している成果物をインクリメントと呼ぶ。スプリント内で対応したものであっても、開発途中の未完成な機能はインクリメントに含めない。

#### デイリースクラム
スプリントの計画が順調に進んでいるかどうか、何らかの問題が発生して目標の達成が困難になっていないか等、開発チームが状況を共有して話し合う場をデイリースクラムと呼ぶ。基本的に毎日、同じ時間で行われる。スプリントのゴールに対しての現時点での評価と懸念、作業内容などを共有する。

#### スプリントレビュー
スプリントで達成したインクリメントを開示する場をスプリントレビューと呼ぶ。ステークホルダーも参加し、実際に動作するソフトウェアを見せたり、触ってもらい、具体的なフィードバックを得る。フィードバックは内容を議論した後にプロダクトバックログへと反映される。

#### レトロスペクティブ
スプリントを振り返り、上手くいかなかった問題や、成果が出なかった要因などの意見を出し合う場をレトロスペクティブと呼ぶ。提示された問題で優先度の高いものから具体的な改善策を検討し、次回のスプリントに取り入れていく。

## スクラム開発の見積もり
ウォーターホール開発では、実装作業がどれくらいの時間で完了するのかを絶対値で算出する。8hを1人日とした場合、合計で何人日かかるのか、という時間単位での計算だ。しかし、不確定要素がある場合に工数を絶対値で算出するのは難しい。また、同じ1人日であったとしても、作業者によってパフォーマンスに違いが出てきたりする。スクラムはこれらの不確実性を無くす為に相対見積もりで工数を算出する。  
例えば、高さが様々な木々の中から一つを選び、その木の正確な高さを見積もって欲しいと言われたとする。その木を見ただけで正確に何メートルであるかを計測するのは難しく、実際に木を登って測ってみないと算出出来ない。しかし、見積もりは木に登る前に終わらせる必要がある。ここで算出される高さの見積もりは、精度が低いものになる。  
  
これが相対見積もりであった場合はどうか。木の正確な高さではなく、この木は他の木々と比べてどうか、という基準で判定を行う事が出来る。「この木は周りの木々と比べて一際高い」あるいは「この木は周りの木々と比べて平均的な高さ」というような見積もりを算出できる。  
これをプロダクトバックログの項目に当てはめてみる。実装される機能によって不確実性は様々だが、まずは開発チームが作業内容を明確にイメージしやすい項目を見積もる。そこから、他の項目はこの項目に比べてどうか、という基準で見積もりを進めていく。  

### フィボナッチ数
不確実性をより分かりやすくする為に、相対見積もりではフィボナッチ数を使用する。フィボナッチ数は「1、2、3、5、8、13...」というように、数字が大きくなる程にポイントの幅が広がっていく。これは、見積もりが大きいものは相応の不確実性を含むという考え方である。1ポイント辺りの具体的な工数はチームの共通認識に依存する為、ポイント＝時間に換算する事は出来ない。「1ポイントの作業は大体これくらいの作業だ」というような共通認識を開発チームで持ち、ここから見積もりの数値を各自で提示し、議論の後に決定する。  

#### ベロシティ
スプリントを終えると、事前に見積もったポイントをどれくらい消化できたのかが計測できる。これを何スプリントか継続し、平均を割り出す事が出来れば、チームが1スプリントで消化できるポイントの総数が見えてくる。これをベロシティと呼ぶ。ベロシティの計算が出来れば規模の大きい機能であっても、大体○スプリントで達成できる、というような予測を立てる事が出来る。  
その為、スプリントで設定した目標の達成が難しい場合に、無理にハードワークをして目標を達成する事は、ベロシティの精度を落とす事になるので推奨されない。ゴール達成が出来なかった場合に考慮されるべきは、どのような要因で達成が出来なかったのか、そして、それを事前に見積もる事が出来なかったのは何故か、である。これらを正確に議論して見積もりの精度を高める事が重要である。  

## スプリントの計画を立てる
プロダクトオーナーがスプリントで達成したい目標を共有し、その為に実施するプロダクトバックログ項目を提示する。開発チームはプロダクトバックログ項目の内容を紐解いて、どのような実装が必要か、機能単位に分解してスプリントバックログで計画を立てる。「ユーザーが商品を検索できる」という項目であれば、「検索画面の実装」と「商品データベースの構築」、「検索処理の検証」などが必要になってくる。実装内容を分解したものをタスクと呼び、タスクにもそれぞれ見積もりをつける。タスクは、フィボナッチ数を用いた相対見積もりではなく、時間単位での絶対見積もりが利用される場合もある。これらを考慮して、スプリントで目標を達成できるかを判定し、問題がなければスプリントを開始する。

## 計画が順調か確認する
スプリントの状況をデイリースクラムで確認し、問題が発生している場合は解決策を考える。デイリースクラムで行われるのはあくまでも共有と問題の検知であり、実装内容の相談や問題解決を行う場ではない。問題解決が必要な場合は、必要な人員のみで別途会議を設ける。ここで重要なのは、ただ進捗を共有するのではなく、ゴールに対して現在位置はどうか、懸念点はあるか、準備は出来ているか、という事項を共有し、それが出来ていない場合に検知をする事である。スプリントが計画通りに進んでいない場合は、必ず何かしらの要因があり、それを明らかにしておきたい。そして、軌道修正を行う余地があればスプリント期間内に実施して、ゴールに少しでも近づけるよう最善を尽くす必要がある。

### バーンダウンチャート
スプリントの進捗を計測するグラフにバーンダウンチャートがある。タスクの見積もりの合計値を縦軸に、スプリントの営業日を横軸に記載して折れ線グラフを作る。最終日までに工数がゼロになる理想線を引いておき、実線は日々のタスク消化に応じて下降する。理想線と比較して実線はどうか、作業が順調に進んでいるのかを確認する事ができる。

## 成果を確認してフィードバックを得る
スプリントの終わりには、達成した項目をスプリントレビューで披露する。スプリントでどのような進捗があり、何を達成したのか、何が達成できていないのかを確認する。ステークホルダーも招待され、デモを用いて完成品を動かしながら、プロダクトオーナー、あるいは開発チームが解説を行う。デモには制作途中のものや正常に動作しない機能は含めない。しかし、未達の項目や今後制作予定の機能などは共有を行う。デモを実際に動かして確認を行い、具体的なフィードバックを受ける。フィードバックの内容はプロダクトバックログの項目に追加され、更新されたプロダクトバックログは新たな優先度順に並べ替えられる。これによって、次回以降のスプリントで何を実施すべきかを明確にしていく。

## スプリントを振り返り、改善を繰り返す
スプリントレビューが終わると、スプリントで最後のイベントとなるレトロスペクティブを行う。ここではスプリント期間内に発生した問題や上手くいかなかった事を共有し、チームで議論をして具体的な解決策を考える。レトロスペクティブは問題提起を行う場ではなく、必ず改善のアクションを決定する必要がある。また、そのアクションはプロダクトバックログにも反映され、次回以降のスプリントで取り組むべき課題とされる。「ミスのないように頑張る」というような精神論での改善はその後の計測が難しいので、アクションを定義し、それを計測するという事が最も重要である。

## まとめ
以上がスプリントの概要と大まなかな流れである。  
スプリントレビュー、スプリントレトロスペクティブの結果によってプロダクトバックログが更新され、新たにスプリントプランニングを行い、そのサイクルを繰り返していく。
スクラムでは失敗を許容する。重要なのは失敗が計測可能である事で、計測を行うことで改善を繰り返していく。  
スクラム開始時点では見積もりの精度は低く、スプリントを重ねる事で精度が高まる。開発要件も徐々に詳細度が高まっていく。  
最初から全てを完璧にこなす必要はないが、常に進化する事が求められる開発手法であり、コントロールは非常に難しい。  
スクラムマスターはこれらの全責任を負い、コントロールを担うので、非常に大きな役割となる。  
コントロールは難しいが、上手く回す事が出来ればスピーディな開発体験を得る事が出来る。  