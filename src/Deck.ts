/// <reference path="Cards.ts" />

module Decks {
    export class Deck {
        private _numberOfDecks: number = 1;
        private _orderedCards: Cards.Card[];
        private _shuffledDeck: Cards.Card[];

        constructor(public numberOfDecks = 1, orderedCards = [], shuffledDeck = []) {
            this._numberOfDecks = numberOfDecks;
            this._orderedCards = orderedCards;
            this._shuffledDeck = shuffledDeck;
            this.initializeDeck();
        }

        public getCardsInDeck(): Cards.Card[]
        {
            return this._shuffledDeck;
        }

        public shuffle() {
            var shuffledDeck = [];
            var usedIndices = [];

            while (shuffledDeck.length < 52) {
                var randomIndex = Math.floor(Math.random() * 52); // TODO: use a true random generator

                if (this.isIndexUsed(usedIndices, randomIndex)) {
                    shuffledDeck.push(this._orderedCards[randomIndex]);
                    usedIndices.push(randomIndex);
                }
            }

            this._shuffledDeck = shuffledDeck;
        }

        private initializeDeck() {
            this._orderedCards = [];

            for (var i = 1; i <= this._numberOfDecks; i++) {
                for (var j = 1; j <= 13; j++) {
                    this._orderedCards.push(new Cards.Card(CardSuit.Club, i * j));
                }

                for (var j = 1; j <= 13; j++) {
                    this._orderedCards.push(new Cards.Card(CardSuit.Spade, i * j));
                }

                for (var j = 1; j <= 13; j++) {
                    this._orderedCards.push(new Cards.Card(CardSuit.Heart, i * j));
                }

                for (var j = 1; j <= 13; j++) {
                    this._orderedCards.push(new Cards.Card(CardSuit.Diamond, i * j));
                }
            }
        }

        private isIndexUsed(indices: number[], index: number): boolean {
            return indices.indexOf(index) === -1;
        }
    }
}