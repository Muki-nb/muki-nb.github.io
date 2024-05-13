function buildCard(name, description, func = (game)=>{}){
    return {
        name,
        description,
        func,
        copy: function(){
            return {
                ...this
            };
        }
    }
}

let cards = {
    "开荒" : buildCard
    (
        "开荒", 
        "粮食 + 1<br><b>一次性</b>", 
        function(game){
            game.addX("粮食", +1);
            game.removeCard(this);
        }
    ),
    "鼓励生育" : buildCard
    (
        "鼓励生育", 
        "人口 + 1<br>粮食 - 1", 
        function(game){
            game.addX("人口", +1);
            game.addX("粮食", -1);
        }
    ),
    "征募" : buildCard
    (
        "征募", 
        "军力 + 1<br>人口 - 1", 
        function(game){
            game.addX("军力", +1);
            game.addX("人口", -1);
        }
    ),
    "福利政策" : buildCard
    (
        "福利政策", 
        "社会 + 1<br>经济 - 1", 
        function(game){
            game.addX("社会", +1);
            game.addX("经济", -1);
        }
    ),
    "封帝" : buildCard
    (
        "封帝", 
        "社会 - 2<br><b>跨越时代</b>", 
        function(game){
            game.addX("社会", - 2);
            game.removeCard(this);
            for(let card of cardset.captain){
                game.yard.push(card.copy());
            }
        }
    ),
    "耕种" : buildCard
    (
        "耕种", 
        "粮食 + 1<br>牲畜/人口 - 1", 
        function(game){
            game.addX("粮食", +1);
            if(game.getX("牲畜") >= 1) game.addX("牲畜", -1);
            else game.addX("人口", -1);
        }
    ),
    "游牧" : buildCard
    (
        "游牧", 
        "牲畜 + 2<br>人口 - 1", 
        function(game){
            game.addX("牲畜", +2);
            game.addX("人口", -1);
        }
    ),
    "采掘" : buildCard
    (
        "采掘", 
        "矿物 + 2<br>人口 - 1", 
        function(game){
            game.addX("矿物", +2);
            game.addX("人口", -1);
        }
    ),
    "贸易" : buildCard
    (
        "贸易", 
        "经济 + 1<br>社会 + 1<br>矿物/牲畜/粮食 - 1", 
        function(game){
            game.addX("经济", +1);
            game.addX("社会", +1);
            if(game.getX("矿物") >= 1) game.addX("矿物", -1);
            else if(game.getX("牲畜") >= 1) game.addX("牲畜", -1);
            else game.addX("粮食", -1);
        }
    ),
    "征战" : buildCard
    (
        "征战", 
        "经济 + 1<br>人口 + 1<br>粮食 + 1<br>社会 - 1<br>军力 - 1", 
        function(game){
            game.addX("经济", +1);
            game.addX("人口", +1);
            game.addX("粮食", +1);
            game.addX("社会", -1);
            game.addX("军力", -1);
        }
    ),
    "练兵" : buildCard
    (
        "练兵", 
        "军力 + 2<br>人口 - 1<br>粮食 - 1", 
        function(game){
            game.addX("军力", +2);
            game.addX("人口", -1);
            game.addX("粮食", -1);
        }
    ),
    "生育即福" : buildCard
    (
        "生育即福", 
        "人口 + 2<br>粮食 - 1<br><b>一次性</b>", 
        function(game){
            game.addX("人口", +2);
            game.addX("粮食", -1);
            game.removeCard(this);
        }
    ),
    "启迪" : buildCard
    (
        "启迪", 
        "知识 + 1", 
        function(game){
            game.addX("知识", +1);
        }
    ),
    "齿轮" : buildCard
    (
        "齿轮", 
        "知识/经济共 - 3<br>科技 + 1<br><b>跨越时代</b><br><i>(每一轮军力-1)</i>", 
        function(game){
            let n = game.getX("知识");
            if(n >= 3) game.addX("知识", -3);
            else{
                game.addX("知识", -n);
                game.addX("经济", -(3-n));
            }
            game.addX("科技", +1);
            game.removeCard(this);
            game.removeSet("start");
            for(let card of cardset.wheel){
                game.yard.push(card.copy());
            }
            game.consume.push(function(game){
                game.addX("军力", -1);
            });
        }
    ),
    "生动机" : buildCard
    (
        "生动机", 
        "矿物/牲畜/人口 - 1<br>动力 + 2", 
        function(game){
            if(game.getX("矿物") >= 1) game.addX("矿物", -1);
            else if(game.getX("牲畜") >= 1) game.addX("牲畜", -1);
            else game.addX("人口", -1);

            game.addX("动力", +2);
        }
    ),
    "化肥" : buildCard
    (
        "化肥", 
        "粮食 + X(矿物)<br>矿物 - 1<br>人口 - 1", 
        function(game){
            let x = game.getX("矿物");
            game.addX("粮食", +x);
            game.addX("矿物", -1);
            game.addX("人口", -1);
        }
    ),
    "人权保障" : buildCard
    (
        "人权保障", 
        "社会 + 1<br>经济 - 2<br>+<b>工作需求</b><br>+<b>饮食质量</b><br>+<b>医疗</b>", 
        function(game){
            game.addX("社会", +1);
            game.addX("经济", -2);
            game.deck.push(cards["工作需求"].copy());
            game.deck.push(cards["饮食质量"].copy());
            game.deck.push(cards["医疗"].copy());
            game.shuffle();
        }
    ),
    "工作需求" : buildCard
    (
        "工作需求", 
        "社会 + 1<br>经济 + 1<br>人口 - 1<br><b>一次性</b>", 
        function(game){
            game.addX("社会", +1);
            game.addX("经济", +1);
            game.addX("人口", -1);

            game.removeCard(this);
        }
    ),
    "饮食质量" : buildCard
    (
        "饮食质量", 
        "社会 + 1<br>经济 + 1<br>牲畜/粮食-1<br><b>一次性</b>", 
        function(game){
            game.addX("社会", +1);
            game.addX("经济", +1);
            if(game.getX("牲畜") >= 1) game.addX("牲畜", -1);
            else game.addX("粮食", -1);

            game.removeCard(this);
        }
    ),
    "医疗" : buildCard
    (
        "医疗", 
        "社会 + 1<br>知识/经济 - 1<br><b>一次性</b>", 
        function(game){
            game.addX("社会", +1);
            if(game.getX("知识") >= 1) game.addX("知识", -1);
            else game.addX("经济", -1);

            game.removeCard(this);
        }
    ),
    "婚育政策" : buildCard
    (
        "婚育政策", 
        "人口 + X(社会)-1<br>经济 - 1", 
        function(game){
            let x = game.getX("社会");
            game.addX("人口", +(x-1));
            game.addX("经济", -1);
        }
    ),
    "工厂" : buildCard
    (
        "工厂", 
        "经济 + X(人口+动力)<br>动力/人口 - 2<br>社会 - 1", 
        function(game){
            let x = game.getX("人口") + game.getX("动力");
            game.addX("经济", +x);
            let n = game.getX("动力");
            if(n >= 2) game.addX("动力", -2);
            else{
                game.addX("动力", -n);
                game.addX("人口", -(2 - n));
            }
            game.addX("社会", -1);
        }
    ),
    "兵工" : buildCard
    (
        "兵工", 
        "军力 + X(人口)-1<br>动力/矿物/人口 - 2<br>知识/社会 - 2", 
        function(game){
            game.addX("军力", +game.getX("人口"));
            let n = game.getX("动力"), m = game.getX("矿物");
            if(n >= 2) game.addX("动力", -2);
            else if(m + n >= 2){
                game.addX("动力", -n);
                game.addX("矿物", -(2-n));
            }else{
                game.addX("动力", -n);
                game.addX("矿物", -m);
                game.addX("人口", -(2-n-m));
            }
            n = game.getX("知识");
            if(n >= 2) game.addX("知识", -2);
            else{
                game.addX("知识", -n);
                game.addX("社会", -(2 - n));
            }
        }
    ),
    "信仰" : buildCard
    (
        "信仰", 
        "社会 + 3<br>知识 - 1<br>-<b>随机上时代卡牌</b>", 
        function(game){
            game.addX("社会", +3);
            game.addX("知识", -1);

            let cards = [];
            for(let card of cardset["captain"]) cards.push(card.name);
            for(let cardname of cards){
                if(removeCard(cardname)) break;
            }
        }
    ),
    "电与能" : buildCard
    (
        "电与能", 
        "知识/人口 - 3<br>矿物/军力 - 3<br>科技 + 2<br>动力 + 5<br><b>一次性</b>", 
        function(game){
            let n = game.getX("知识");
            if(n >= 3) game.addX("知识", -3);
            else{
                game.addX("知识", -n);
                game.addX("人口", -(3 - n));
            }
            n = game.getX("矿物");
            if(n >= 3) game.addX("矿物", -3);
            else{
                game.addX("矿物", -n);
                game.addX("军力", -(3 - n));
            }
            game.addX("科技", +2);
            game.addX("动力", +5);

            game.removeCard(this);
        }
    ),
    "生电" : buildCard
    (
        "生电", 
        "动力/军力 - 5<br>矿物/经济 - 3<br>知识/社会 - 2<br>科技 + 1<br><b>跨越时代</b><br><i>(每一轮经济-1)</i>", 
        function(game){
            let n = game.getX("动力");
            if(n >= 5) game.addX("动力", -5);
            else{
                game.addX("动力", -n);
                game.addX("军力", -(5 - n));
            }

            n = game.getX("矿物");
            if(n >= 3) game.addX("矿物", -3);
            else{
                game.addX("矿物", -n);
                game.addX("经济", -(3 - n));
            }

            n = game.getX("知识");
            if(n >= 2) game.addX("知识", -2);
            else{
                game.addX("知识", -n);
                game.addX("社会", -(2 - n));
            }
            game.addX("科技", +1);

            game.removeCard(this);
            game.removeSet("captain");
            for(let card of cardset.elec){
                game.yard.push(card.copy());
            }
            game.consume.push(function(game){
                game.addX("经济", -1);
            });
        }
    ),
    
    "电力计划":buildCard(
        "电力计划",
        "<b>所有</b> + 1<br><i>你已到达目前开发的顶峰！享受游戏吧！</i>"
    )
}

let cardset = {
    "start":[
        cards["封帝"],
        cards["开荒"],
        cards["开荒"],
        cards["开荒"],
        cards["征募"],
        cards["福利政策"],
        cards["鼓励生育"]
    ],
    "captain":[
        cards["齿轮"],
        cards["启迪"],
        cards["生育即福"],
        cards["生育即福"],
        cards["练兵"],
        cards["征战"],
        cards["贸易"],
        cards["游牧"],
        cards["采掘"],
        cards["耕种"],
        cards["耕种"],
    ],
    "wheel":[
        cards["生动机"],
        cards["化肥"],
        cards["人权保障"],
        cards["婚育政策"],
        cards["工厂"],
        cards["兵工"],
        cards["信仰"],
        cards["电与能"],
        cards["生电"],
    ],
    "elec":[
        cards["电力计划"]
    ]
}

let sets = [
    "start",
    "captain",
    "wheel",
    "elec"
]