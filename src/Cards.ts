enum CardSuit {
    Club = 1,
    Spade = 2,
    Heart = 3,
    Diamond = 4
}

enum CardRank {
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13
}

module Cards {
    export class Card {
        private CARD_WIDTH: number = 73;
        private CARD_HEIGHT: number = 98;
        private _destinationX: number = 10;
        private _destinationY: number = 10;
        private _destinationWidth: number = 0;
        private _destinationHeight: number = 0;
        private _suit: CardSuit;
        private _rank: CardRank;

        constructor(public suit: CardSuit, public rank: CardRank) {
            this._destinationWidth = this.CARD_WIDTH;
            this._destinationHeight = this.CARD_HEIGHT;
            this._suit = suit;
            this._rank = rank;
        }

        getCardImage(context: CanvasRenderingContext2D, image: CanvasImageSource) {
            var rank = this._rank;
            var suit = this._suit;
            var sourceX = (rank - 1) * this.CARD_WIDTH;
            var sourceY = (suit - 1) * this.CARD_HEIGHT;

            context.drawImage(image,
                sourceX,
                sourceY,
                this.CARD_WIDTH,
                this.CARD_HEIGHT,
                this._destinationX,
                this._destinationY,
                this._destinationWidth,
                this._destinationHeight);
        }

        getCardImageWithPosition(context: CanvasRenderingContext2D,
                                 image: CanvasImageSource,
                                 destinationX: number,
                                 destinationY: number) {
            var rank = this._rank;
            var suit = this._suit;
            var sourceX = (rank - 1) * this.CARD_WIDTH;
            var sourceY = (suit - 1) * this.CARD_HEIGHT;

            context.drawImage(image,
                sourceX,
                sourceY,
                this.CARD_WIDTH,
                this.CARD_HEIGHT,
                destinationX,
                destinationY,
                this._destinationWidth,
                this._destinationHeight);
        }
    }
} 