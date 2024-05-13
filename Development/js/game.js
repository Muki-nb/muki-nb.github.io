function buildGame(config = {}){
    let deck = [];
    for(let card of cardset.start) deck.push(card.copy());
    return {
        hand : [],
        deck : [...deck],
        yard : [],
        attribute : {
            "经济": 2,
            "军力": 2,
            "人口": 2,
            "社会": 2,
            "粮食": 2,
            "科技": 5,
            ...config
        },

        lifetime: 0,
        activetime: 0,
    
        getX : function(attribute){
            if(!(attribute in this.attribute)) return 0;
            return this.attribute[attribute];
        },

        addX : function(attribute, x){
            if(!(attribute in this.attribute)) this.attribute[attribute] = 0;
            this.attribute[attribute] += x;
            if(this.attribute[attribute] > this.attribute["科技"]) this.attribute[attribute] = this.attribute["科技"];
            if(this.attribute[attribute] < 0) this.attribute[attribute] = 0;
        },

        setX : function(attribute, x){
            if(!(attribute in this.attribute)) this.attribute[attribute] = 0;
            this.attribute[attribute] = x;
            if(this.attribute[attribute] > this.attribute["科技"]) this.attribute[attribute] = this.attribute["科技"];
        },

        useCard : function(card){
            card.func(this);
            this.activetime++;
        },

        consume : [
            function(game){
                game.lifetime++;
            },
            function(game){
                game.addX("粮食", -1)
            }
        ],
        afterUseCard : function(){
            while(this.hand.length > 0){
                this.yard.push(this.hand[0]);
                this.hand.shift();
            }

            if(this.deck.length == 0){
                for(let consumefunc of this.consume){
                    consumefunc(game);
                }
                while(this.yard.length > 0){
                    this.deck.push(this.yard[0]);
                    this.yard.shift();
                }
                this.shuffle();
            }

            this.draw();
        },

        draw : function(){
            while(this.hand.length < this.attribute["科技"] - 2 && this.hand.length <= 5 && this.deck.length > 0){
                this.hand.push(this.deck[0]);
                this.deck.shift();
            }
        },

        shuffle : function(){
            for(let i = 0;i < this.deck.length;i++){
                let index = Math.floor(Math.random() * (this.deck.length - i)) + i;
                let t = this.deck[index];
                this.deck[index] = this.deck[i];
                this.deck[i] = t;
            }
        },

        removeCard : function(card){
            for(let i = 0;i < this.hand.length;i++){
                if(this.hand[i] == card){
                    this.hand.splice(i, 1);
                    return true;
                }
            }
            for(let i = 0;i < this.deck.length;i++){
                if(this.deck[i] == deck){
                    this.deck.splice(i, 1);
                    return true;
                }
            }
            for(let i = 0;i < this.yard.length;i++){
                if(this.yard[i] == card){
                    this.yard.splice(i, 1);
                    return true;
                }
            }
            return false;
        },

        removeSet : function(set){
            let cards = [];
            for(let card of cardset[set]) cards.push(card.name);

            for(let i = 0;i < this.hand.length;i++){
                if(cards.includes(this.hand[i].name)){
                    this.hand.splice(i, 1);
                    i--;
                }
            }
            for(let i = 0;i < this.deck.length;i++){
                if(cards.includes(this.deck[i].name)){
                    this.deck.splice(i, 1);
                    i--;
                }
            }
            for(let i = 0;i < this.yard.length;i++){
                if(cards.includes(this.yard[i].name)){
                    this.yard.splice(i, 1);
                    i--;
                }
            }
        },
    
        overConditions : [
            function(game){
                if(game.attribute["粮食"] <= 0){
                    return {
                        code : true,
                        content : "粮食危机已经成为了主要矛盾，但你并没有解决……于是一个文明在人吃人的堕落中就此覆灭。"
                    };
                }
            },
            function(game){
                if(game.attribute["经济"] <= 0){
                    return {
                        code : true,
                        content : "经济危机已经成为了主要矛盾，但你并没有解决……无止尽的生产，不存在的需求，最终吞没了虚假的泡沫。"
                    };
                }
            },
            function(game){
                if(game.attribute["军力"] <= 0){
                    return {
                        code : true,
                        content : "军事危机已经成为了主要矛盾，但你并没有解决……任人宰割的羔羊从来不会是宴席的宾客。"
                    };
                }
            },
            function(game){
                if(game.attribute["人口"] <= 0){
                    return {
                        code : true,
                        content : "人口危机已经成为了主要矛盾，但你并没有解决……文明在不灭的碑林中腐烂，直到生机重新踏入这片土地。"
                    };
                }
            },
            function(game){
                if(game.attribute["社会"] <= 0){
                    return {
                        code : true,
                        content : "社会危机已经成为了主要矛盾，但你并没有解决……信任瓦解，群起如猛兽，将一切推向了新的篇章。"
                    };
                }
            }
        ],

        isOver : function(){
            for(let condition of this.overConditions){
                let result = condition(this) || { code : false };
                if(result.code){
                    return result;
                }
            }
            return {
                code : false
            };
        },

        start: function(){
            this.shuffle();
            this.draw();
        }
    };
}