$(document).ready(function () {
    const CARD_WIDTH = 73
    let xPosOfNextPlayer1Card = 0;
    let xPosOfNextDealerCard = 0;
    let player1CardTotal = 0;
    let dealerCardTotal = 0;
    let dealerAces = 0;
    let playerAces = 0;
    let playerCurrentValueOfAce = 11;
    let dealerCurrentValueOfAce = 11;

    const canvas: HTMLCanvasElement = document.querySelector('#simpleCanvas') ?? new HTMLCanvasElement();
    
    if(canvas === null) {
        return;
    }

    canvas.setAttribute("width", "800px");
    canvas.setAttribute("height", "450px");

    const context = canvas.getContext('2d') ?? new CanvasRenderingContext2D();

    resetCanvas();

    const cards = new Image();
    cards.src = "img/cards.png";
    cards.onload = function () {
        let deck = new Decks.Deck(1);
        deck.shuffle();

        let cardsInDeck = deck.getCardsInDeck();

        initializeCards(cardsInDeck);

        resetButtons(false);

        $("#btnHit").click(function () {
            displayPlayerNextCard(context, cardsInDeck);
            
            if (isBusted(player1CardTotal)) {
                displayWinner(context, "Dealer");
                resetButtons(true);
            }
            else if (isBlackJack(player1CardTotal)) {
                stand(context, cardsInDeck);                            
            }
        });

        $("#btnStand").click(function () {
            stand(context, cardsInDeck);
        });

        $("#btnRefresh").click(function () {
            resetCanvas();
            initializeCards(cardsInDeck);
            resetButtons(false);
        });
    }

    function resetButtons(winnerDeclared: boolean) {
        if (winnerDeclared) {
            $("#btnHit, #btnStand").attr("disabled", "disabled");
            $("#btnRefresh").removeAttr("disabled");
        }
        else {
            $("#btnHit, #btnStand").removeAttr("disabled");
            $("#btnRefresh").attr("disabled", "disabled");
        }
    }

    function resetCanvas() {
        context.clearRect(0, 0, 800, 450);

        context.fillStyle = "#477148"; //'rgb(0, 255, 0)';
        context.fillRect(0, 0, 800, 450);

        xPosOfNextPlayer1Card = 0;
        xPosOfNextDealerCard = 0;
        player1CardTotal = 0;
        dealerCardTotal = 0;
        dealerAces = 0;
        playerAces = 0;
        playerCurrentValueOfAce = 11;
        dealerCurrentValueOfAce = 11;
    } 

    function initializeCards(cardsInDeck: Cards.Card[]) {
        displayTitle(context);

        if (cardsInDeck.length <= 12) {
            var deck = new Decks.Deck(1);
            deck.shuffle();
            cardsInDeck = deck.getCardsInDeck();

            alert("Shuffling...");
        }

        displayDealerFirstCard(context, cardsInDeck);
        displayPlayerTitle(context);
        displayPlayerFirstTwoCards(context, cardsInDeck);
    }

    function displayTitle(context: CanvasRenderingContext2D) {
        context.font = "32pt Calibri";
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.strokeText("Dealer", 10, 40);
    }

    function displayDealerFirstCard(context: CanvasRenderingContext2D, cardsInDeck: Cards.Card[]) {
        let x = 10;
        let y = 75;

        let currentCard = cardsInDeck.pop();
        if (currentCard?.rank === CardRank.Ace) {
            dealerAces++;
        }
        currentCard?.getCardImageWithPosition(context, cards, x, y);
        dealerCardTotal = setCardTotal(currentCard, dealerCardTotal, dealerAces, dealerCurrentValueOfAce);
        dealerCurrentValueOfAce = 11;

        xPosOfNextDealerCard += x + CARD_WIDTH + 10;
    }

    function displayPlayerTitle(context: CanvasRenderingContext2D) {
        context.font = "32pt Calibri";
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.strokeText("Player 1", 10, 220);
    }

    function displayPlayerFirstTwoCards(context: CanvasRenderingContext2D, cardsInDeck: Cards.Card[]) {
        let x = 10;
        let y = 250;
        let currentCard = cardsInDeck.pop();
        if (currentCard?.rank === CardRank.Ace) {
            playerAces++;
        }
        currentCard?.getCardImageWithPosition(context, cards, x, y);
        player1CardTotal = setCardTotal(currentCard, player1CardTotal, playerAces, playerCurrentValueOfAce);
        playerCurrentValueOfAce = 11;

        currentCard = cardsInDeck.pop();
        if (currentCard?.rank === CardRank.Ace) {
            playerAces++;
        }
        currentCard?.getCardImageWithPosition(context, cards, x + CARD_WIDTH + 10, y);
        var previousTotal = player1CardTotal;
        player1CardTotal = setCardTotal(currentCard, player1CardTotal, playerAces, playerCurrentValueOfAce);
        playerCurrentValueOfAce = previousTotal == 11 && currentCard?.rank == CardRank.Ace ? 1 : 11;

        xPosOfNextPlayer1Card = 10 + 2 * (CARD_WIDTH + 10);

        if (isBlackJack(player1CardTotal)) {
            stand(context, cardsInDeck);
        }
    }
    
    function stand(context: CanvasRenderingContext2D, cardsInDeck: Cards.Card[]) {
        displayDealerNextCard(context, cardsInDeck);

        if (dealerCardTotal > player1CardTotal) {
            displayWinner(context, "Dealer");
            resetButtons(true);
            return;
        }

        while (!isCardTotalGreaterOrEqualTo17(dealerCardTotal)) {
            displayDealerNextCard(context, cardsInDeck);

            if (isBusted(dealerCardTotal)) {
                displayWinner(context, "Player 1");
                resetButtons(true);
                return;
            }
        }

        if (dealerCardTotal > player1CardTotal) {
            displayWinner(context, "Dealer");
        }
        else if (dealerCardTotal == player1CardTotal) {
            displayWinner(context, "Nobody");
        }
        else {
            displayWinner(context, "Player 1");
        }

        resetButtons(true);
    }

    function displayPlayerNextCard(context: CanvasRenderingContext2D, cardsInDeck: Cards.Card[]) {
        let y = 250;
        
        let currentCard = cardsInDeck.pop();
        if (currentCard?.rank === CardRank.Ace) {
            playerAces++;
        }
        currentCard?.getCardImageWithPosition(context, cards, xPosOfNextPlayer1Card, y);
        var previousTotal = player1CardTotal;
        player1CardTotal = setCardTotal(currentCard, player1CardTotal, playerAces, playerCurrentValueOfAce);
        if (previousTotal <= player1CardTotal) {
            playerCurrentValueOfAce = 1;
        }

        xPosOfNextPlayer1Card += CARD_WIDTH + 10;
    }

    function displayDealerNextCard(context: CanvasRenderingContext2D, cardsInDeck: Cards.Card[]) {
        let y = 75;

        let currentCard = cardsInDeck.pop();
        if (currentCard?.rank === CardRank.Ace) {
            dealerAces++;
        }
        currentCard?.getCardImageWithPosition(context, cards, xPosOfNextDealerCard, y);
        let previousTotal = dealerCardTotal;
        dealerCardTotal = setCardTotal(currentCard, dealerCardTotal, dealerAces, dealerCurrentValueOfAce);
        if (previousTotal <= player1CardTotal) {
            dealerCurrentValueOfAce = 1;
        }

        if (isBlackJack(dealerCardTotal)) {
            if (dealerCardTotal !== player1CardTotal) {
                var winner = dealerCardTotal > player1CardTotal ? "Dealer" : "Player 1";
                displayWinner(context, winner);
            }
            else {
                displayWinner(context, "Nobody");
            }
        }

        xPosOfNextDealerCard += CARD_WIDTH + 10;
    }

    function setCardTotal(card:Cards.Card | undefined, cardTotal: number, numberOfAces:number, currentValueOfAce: number) {
        if (card === undefined) {
            return 0;
        }

        if (card.rank === CardRank.Ace) {
            if (numberOfAces === 1) {
                if (!isBusted(cardTotal + 11)) {
                    cardTotal += 11;
                }
                else {
                    cardTotal += 1;
                }
            }
            else if (numberOfAces == 2) {
                cardTotal -= 10; 
                cardTotal += 1;
            }
            else {
                cardTotal += 1;
            }
        }
        else if (card.rank >= 11) {
            cardTotal += 10;

            if (numberOfAces === 1 && currentValueOfAce === 11 && isBusted(cardTotal)) {
                cardTotal -=10;
            }
        }
        else {
            cardTotal += card.rank;
            
            if (numberOfAces === 1 && currentValueOfAce === 11 && isBusted(cardTotal)) {
                cardTotal -= 10;
            }
        }

        return cardTotal;
    }

    function isBusted(cardTotal: number) {
        return cardTotal > 21;
    }

    function isCardTotalGreaterOrEqualTo17(cardTotal: number) {
        return cardTotal >= 17;
    }

    function displayWinner(context: CanvasRenderingContext2D, player: string) {
        context.font = "32pt Calibri";
        context.lineWidth = 2;
        context.strokeStyle = "red";
        context.strokeText(player + " won!!!", 10, 400);
    }

    function isBlackJack(cardTotal: number) {
        return cardTotal === 21;
    }
});