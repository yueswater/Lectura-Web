export type SequenceType = 'arabic' | 'alpha-low' | 'alpha-up' | 'roman-low' | 'roman-up' | 'celestial';

export class ListSequencer {
    private static CELESTIAL = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    private static ROMAN_LOW = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    private static ROMAN_UP = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    static getSequenceType(marker: string): SequenceType {
        const val = marker.replace('.', '').trim();

        if (/^\d+$/.test(val)) return 'arabic';
        if (val.split('').every(char => this.CELESTIAL.includes(char))) return 'celestial';

        if (this.ROMAN_LOW.includes(val)) return 'roman-low';
        if (this.ROMAN_UP.includes(val)) return 'roman-up';

        if (/^[a-z]+$/.test(val)) return 'alpha-low';
        if (/^[A-Z]+$/.test(val)) return 'alpha-up';

        return 'arabic';
    }

    static getNext(marker: string): string {
        const type = this.getSequenceType(marker);
        const val = marker.replace('.', '').trim();

        switch (type) {
            case 'arabic':
                return (parseInt(val) + 1) + '.';
            case 'celestial':
                return this.incrementString(val, this.CELESTIAL.join('')) + '.';
            case 'roman-low':
                const lowIdx = this.ROMAN_LOW.indexOf(val);
                if (lowIdx !== -1 && lowIdx < this.ROMAN_LOW.length - 1) {
                    return this.ROMAN_LOW[lowIdx + 1] + '.';
                }
                return this.incrementString(val, 'abcdefghijklmnopqrstuvwxyz') + '.';
            case 'roman-up':
                const upIdx = this.ROMAN_UP.indexOf(val);
                if (upIdx !== -1 && upIdx < this.ROMAN_UP.length - 1) {
                    return this.ROMAN_UP[upIdx + 1] + '.';
                }
                return this.incrementString(val.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz').toUpperCase() + '.';
            case 'alpha-low':
                return this.incrementString(val, 'abcdefghijklmnopqrstuvwxyz') + '.';
            case 'alpha-up':
                return this.incrementString(val.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz').toUpperCase() + '.';
            default:
                return marker;
        }
    }

    private static incrementString(s: string, charset: string): string {
        const chars = s.split('');
        let i = chars.length - 1;

        while (i >= 0) {
            const charIdx = charset.indexOf(chars[i]);
            if (charIdx < charset.length - 1) {
                chars[i] = charset[charIdx + 1];
                return chars.join('');
            } else {
                chars[i] = charset[0];
                i--;
            }
        }
        return charset[0] + chars.join('');
    }
}