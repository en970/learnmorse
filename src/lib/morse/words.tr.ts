// Everyday Turkish words used as practice material. As with the English
// list, order doesn't matter here — the teaching engine filters this pool
// at runtime down to whatever the learner has already unlocked. Wrapped in
// a Set to shrug off any accidental duplicates from a list this size.
const RAW_WORDS = [
  "at", "et", "ay", "su", "ip", "iş", "ok", "on", "ev", "kaş", "diş", "baş",
  "yaş", "taş", "kız", "biz", "siz", "bu", "şu", "ne", "ya", "da", "de",
  "ve", "az", "üç", "iki", "bir", "el", "gül", "kul", "kar", "yaz", "kış",
  "yer", "yol", "göz", "söz", "hız", "gün", "sen", "ben", "can", "köy",
  "gök", "güz", "dal", "dağ", "göl", "iyi", "tek", "çok", "yok", "var",
  "bal", "gaz", "tuz", "buz", "kir", "sır", "kır", "tat", "ek", "kuş",
  "boy", "kol", "ata", "it", "ait",

  "anne", "baba", "kedi", "süt", "elma", "masa", "kapı", "çiçek", "kitap",
  "kalem", "tabak", "kaşık", "çatal", "bebek", "çocuk", "insan", "dünya",
  "güneş", "yıldız", "deniz", "nehir", "orman", "kum", "rüzgar", "yağmur",
  "ateş", "hava", "renk", "mavi", "yeşil", "sarı", "siyah", "beyaz", "mor",
  "pembe", "gel", "git", "oku", "koş", "uyu", "otur", "kalk", "bak", "gör",
  "bil", "sev", "iste", "yap", "ver", "al", "sat", "aç", "kapat", "güzel",
  "kötü", "büyük", "küçük", "uzun", "kısa", "hızlı", "yavaş", "sıcak",
  "soğuk", "yeni", "eski", "doğru", "yanlış", "mutlu", "üzgün", "dört",
  "beş", "altı", "yedi", "sekiz", "dokuz", "kardeş", "dede", "nine",
  "teyze", "amca", "hala", "dayı", "köpek", "balık", "inek", "koyun",
  "tavuk", "aslan", "kaplan", "ayı", "tilki", "kurt", "fil", "maymun",
  "ördek", "karınca", "arı", "örümcek", "çay", "kahve", "şeker", "yumurta",
  "peynir", "pilav", "çorba", "salata", "armut", "muz", "üzüm", "çilek",
  "portakal", "ekmek", "sokak", "duvar", "pencere", "oda", "bahçe",
  "okul", "sınıf", "defter", "silgi", "cetvel", "çanta", "ayakkabı",
  "gömlek", "pantolon", "şapka", "eldiven", "atkı", "yastık", "yorgan",
  "battaniye", "sandalye", "dolap", "buzdolabı", "fırın", "tencere",
  "bıçak", "tuzluk", "sepet", "kutu", "anahtar", "kapı", "pencere",
  "merdiven", "asansör", "otobüs", "araba", "bisiklet", "uçak", "tren",
  "gemi", "yol", "köprü", "şehir", "köy", "ülke", "harita", "bayrak",
  "para", "cüzdan", "saat", "takvim", "mektup", "telefon", "bilgisayar",
  "televizyon", "radyo", "müzik", "şarkı", "dans", "resim", "boya",
  "kağıt", "makas", "yapıştırıcı", "top", "oyuncak", "bahçe", "çiçek",
  "yaprak", "kök", "dal", "tohum", "meyve", "sebze", "domates", "salatalık",
  "patates", "soğan", "sarımsak", "biber", "havuç", "ıspanak", "fasulye",
  "mercimek", "pirinç", "un", "yağ", "tuz", "şeker", "bal", "reçel",
  "peynir", "yoğurt", "ayran", "meyve suyu", "limon", "kiraz", "erik",
  "şeftali", "kayısı", "karpuz", "kavun", "nar", "incir", "ceviz",
  "fındık", "badem", "kestane",
];

export const TURKISH_WORDS: string[] = Array.from(
  new Set(
    RAW_WORDS.filter((word) => !word.includes(" ")),
  ),
);
