// @ts-nocheck
/* eslint-disable */
// دیتاست برندهای ترکیه (seed) — استخراج‌شده از نسخهٔ قبلی و بازاستفاده‌شده.
// ساختار هر برند: لینک‌های عمیق تفکیک‌شده بر اساس جنسیت (w/m/k) و زیردسته، یا cats برای آرایشی/خانه/کودک.
export const RATE = 4393;

export const BRANDS = {
  multi: [
    {id:"trendyol", name:"Trendyol", url:"https://www.trendyol.com", domain:"trendyol.com"},
    {id:"hepsiburada", name:"Hepsiburada", url:"https://www.hepsiburada.com", domain:"hepsiburada.com"},
    {id:"n11", name:"N11", url:"https://www.n11.com", domain:"n11.com"},
    {id:"boyner", name:"Boyner", url:"https://www.boyner.com.tr", domain:"boyner.com.tr"},
    {id:"sportive", name:"Sportive", url:"https://www.sportive.com.tr", domain:"sportive.com.tr"},
    {id:"superstep", name:"Superstep", url:"https://www.superstep.com.tr", domain:"superstep.com.tr"},
    {id:"houseofsuperstep", name:"House of Superstep", url:"https://www.houseofsuperstep.com", domain:"houseofsuperstep.com"},
    {id:"intersport", name:"Intersport", url:"https://www.intersport.com.tr", domain:"intersport.com.tr"}
  ],
  clothing: [
    {id:"zara", name:"Zara TR", domain:"zara.com",
     w:{base:"https://www.zara.com/tr/tr/kadin-l1065.html", dress:"https://www.zara.com/tr/tr/kadin-elbiseler-l1066.html", pants:"https://www.zara.com/tr/tr/kadin-pantolonlar-l1335.html", jeans:"https://www.zara.com/tr/tr/kadin-kot-l1335.html", tshirt:"https://www.zara.com/tr/tr/kadin-tisort-l1323.html", blouse:"https://www.zara.com/tr/tr/kadin-bluzlar-gomlek-l1323.html", jacket:"https://www.zara.com/tr/tr/kadin-ceketler-l1336.html", coat:"https://www.zara.com/tr/tr/kadin-montlar-l1109.html", skirt:"https://www.zara.com/tr/tr/kadin-etekler-l1068.html", sweatshirt:"https://www.zara.com/tr/tr/kadin-sweatshirt-l1323.html", suit:"https://www.zara.com/tr/tr/kadin-takim-l1437.html", underwear:"https://www.zara.com/tr/tr/kadin-ic-camasir-l1104.html", swimwear:"https://www.zara.com/tr/tr/kadin-mayo-bikini-l1104.html", shoes:"https://www.zara.com/tr/tr/kadin-ayakkabi-l1251.html", bags:"https://www.zara.com/tr/tr/kadin-canta-l1252.html", accessories:"https://www.zara.com/tr/tr/kadin-aksesuar-l1060.html", beauty:"https://www.zara.com/tr/tr/kadin-makyaj-l1060.html"},
     m:{base:"https://www.zara.com/tr/tr/erkek-l1059.html", pants:"https://www.zara.com/tr/tr/erkek-pantolonlar-l1328.html", jeans:"https://www.zara.com/tr/tr/erkek-kot-l1328.html", shirt:"https://www.zara.com/tr/tr/erkek-gomlek-l1327.html", tshirt:"https://www.zara.com/tr/tr/erkek-tisort-l1327.html", jacket:"https://www.zara.com/tr/tr/erkek-ceket-l1329.html", coat:"https://www.zara.com/tr/tr/erkek-mont-l1110.html", sweatshirt:"https://www.zara.com/tr/tr/erkek-sweatshirt-l1327.html", suit:"https://www.zara.com/tr/tr/erkek-takim-l1340.html", underwear:"https://www.zara.com/tr/tr/erkek-ic-camasir-l1107.html", shoes:"https://www.zara.com/tr/tr/erkek-ayakkabi-l1362.html", bags:"https://www.zara.com/tr/tr/erkek-canta-l1361.html", accessories:"https://www.zara.com/tr/tr/erkek-aksesuar-l1360.html"},
     k:{girl:"https://www.zara.com/tr/tr/kiz-bebek-kiz-cocuk-l10801.html", boy:"https://www.zara.com/tr/tr/erkek-bebek-erkek-cocuk-l10901.html", teen_girl:"https://www.zara.com/tr/tr/genc-kiz-l14000.html", teen_boy:"https://www.zara.com/tr/tr/s-chocuklar-erkek-chocuk-l13807.html"},
     home:{base:"https://www.zara.com/tr/en/home-mkt2085.html", bedroom:"https://www.zara.com/tr/en/home-bedroom-l2087.html", decor:"https://www.zara.com/tr/en/home-decoration-mkt6612.html", furniture:"https://www.zara.com/tr/en/home-furniture-l6181.html"}},
    {id:"mango", name:"Mango TR", domain:"mango.com",
     w:{base:"https://shop.mango.com/tr/tr/h/kadin", dress:"https://shop.mango.com/tr/tr/c/kadin/elbise-ve-tulum_5f4ab0b9", pants:"https://shop.mango.com/tr/tr/c/kadin/pantolon_b126cc9c", jeans:"https://shop.mango.com/tr/tr/c/kadin/jean_3e4e98c0", blouse:"https://shop.mango.com/tr/tr/c/kadin/gomlek-ve-bluz_a5cb7e81", tshirt:"https://shop.mango.com/tr/tr/c/kadin/tisort_3e3c0fca", jacket:"https://shop.mango.com/tr/tr/c/kadin/ceket_f6a6e1d8", coat:"https://shop.mango.com/tr/tr/c/kadin/palto_3e3c0fca", skirt:"https://shop.mango.com/tr/tr/c/kadin/etek_a5cb7e81", sweatshirt:"https://shop.mango.com/tr/tr/c/kadin/sweatshirt_3e3c0fca", suit:"https://shop.mango.com/tr/tr/c/kadin/blazer-ceket_a5cb7e81", shoes:"https://shop.mango.com/tr/tr/c/kadin/ayakkabi_e38a534b", bags:"https://shop.mango.com/tr/tr/c/kadin/canta_e38a534b", jewelry:"https://shop.mango.com/tr/tr/c/kadin/bijuteri_e38a534b", belts:"https://shop.mango.com/tr/tr/c/kadin/kemer_e38a534b", scarves:"https://shop.mango.com/tr/tr/c/kadin/esarp-ve-fular_e38a534b", sunglasses:"https://shop.mango.com/tr/tr/c/kadin/gunes-gozlugu_e38a534b"},
     m:{base:"https://shop.mango.com/tr/tr/h/erkek", pants:"https://shop.mango.com/tr/tr/c/erkek/pantolon_b126cc9c", jeans:"https://shop.mango.com/tr/tr/c/erkek/jean_3e4e98c0", shirt:"https://shop.mango.com/tr/tr/c/erkek/gomlek_a5cb7e81", tshirt:"https://shop.mango.com/tr/tr/c/erkek/tisort_3e3c0fca", jacket:"https://shop.mango.com/tr/tr/c/erkek/ceket_f6a6e1d8", coat:"https://shop.mango.com/tr/tr/c/erkek/mont_3e3c0fca", suit:"https://shop.mango.com/tr/tr/c/erkek/takim_a5cb7e81", sweatshirt:"https://shop.mango.com/tr/tr/c/erkek/sweatshirt_3e3c0fca", shoes:"https://shop.mango.com/tr/tr/c/erkek/ayakkabi_e38a534b", bags:"https://shop.mango.com/tr/tr/c/erkek/canta_e38a534b", accessories:"https://shop.mango.com/tr/tr/c/erkek/aksesuar_e38a534b"},
     k:{girl:"https://shop.mango.com/tr/tr/c/cocuk/kiz-cocuk_f3b158de", boy:"https://shop.mango.com/tr/tr/c/cocuk/erkek-cocuk_e89704ef"}},
    {id:"hm", name:"H&M TR", domain:"hm.com",
     w:{base:"https://www2.hm.com/tr_tr/kadin.html", dress:"https://www2.hm.com/tr_tr/kadin/urunler/elbiseler.html", pants:"https://www2.hm.com/tr_tr/kadin/urunler/pantolonlar.html", jeans:"https://www2.hm.com/tr_tr/kadin/urunler/kot-pantolonlar.html", tshirt:"https://www2.hm.com/tr_tr/kadin/urunler/tishortler-ve-atletler.html", blouse:"https://www2.hm.com/tr_tr/kadin/urunler/bluzlar-ve-tunikler.html", jacket:"https://www2.hm.com/tr_tr/kadin/urunler/ceketler-ve-blazerler.html", coat:"https://www2.hm.com/tr_tr/kadin/urunler/montlar-ve-kabanlar.html", skirt:"https://www2.hm.com/tr_tr/kadin/urunler/etekler.html", sweatshirt:"https://www2.hm.com/tr_tr/kadin/urunler/hoodiler-ve-sweatshirtler.html", underwear:"https://www2.hm.com/tr_tr/kadin/urunler/sutyenler.html", swimwear:"https://www2.hm.com/tr_tr/kadin/urunler/mayo-ve-bikiniler.html", shoes:"https://www2.hm.com/tr_tr/kadin/ayakkabi.html", bags:"https://www2.hm.com/tr_tr/kadin/canta.html", accessories:"https://www2.hm.com/tr_tr/kadin/aksesuarlar.html", beauty:"https://www2.hm.com/tr_tr/guzellik.html"},
     m:{base:"https://www2.hm.com/tr_tr/erkek.html", pants:"https://www2.hm.com/tr_tr/erkek/urunler/pantolonlar.html", jeans:"https://www2.hm.com/tr_tr/erkek/urunler/kot-pantolonlar.html", shirt:"https://www2.hm.com/tr_tr/erkek/urunler/gomlekler.html", tshirt:"https://www2.hm.com/tr_tr/erkek/urunler/tishortler-ve-atletler.html", jacket:"https://www2.hm.com/tr_tr/erkek/urunler/ceketler-ve-blazerler.html", coat:"https://www2.hm.com/tr_tr/erkek/urunler/montlar-ve-kabanlar.html", sweatshirt:"https://www2.hm.com/tr_tr/erkek/urunler/hoodiler-ve-sweatshirtler.html", suit:"https://www2.hm.com/tr_tr/erkek/urunler/takim-elbiseler.html", underwear:"https://www2.hm.com/tr_tr/erkek/urunler/ic-camasirlar.html", shoes:"https://www2.hm.com/tr_tr/erkek/ayakkabi.html", bags:"https://www2.hm.com/tr_tr/erkek/canta.html", accessories:"https://www2.hm.com/tr_tr/erkek/aksesuarlar.html"},
     k:{girl:"https://www2.hm.com/tr_tr/kiz-cocuk.html", boy:"https://www2.hm.com/tr_tr/erkek-cocuk.html", teen_girl:"https://www2.hm.com/tr_tr/genc-kiz.html", teen_boy:"https://www2.hm.com/tr_tr/genc-erkek.html", baby:"https://www2.hm.com/tr_tr/bebek.html"}},
    {id:"koton", name:"Koton", domain:"koton.com",
     w:{base:"https://www.koton.com/kadin", dress:"https://www.koton.com/kadin-elbise", pants:"https://www.koton.com/kadin-pantolon", jeans:"https://www.koton.com/kadin-kot-pantolon", tshirt:"https://www.koton.com/kadin-tisort", blouse:"https://www.koton.com/kadin-bluz", shirt:"https://www.koton.com/kadin-gomlek", jacket:"https://www.koton.com/kadin-ceket", coat:"https://www.koton.com/kadin-mont-kaban", skirt:"https://www.koton.com/kadin-etek", sweatshirt:"https://www.koton.com/kadin-sweatshirt", underwear:"https://www.koton.com/kadin-ic-giyim", shoes:"https://www.koton.com/kadin-ayakkabi", bags:"https://www.koton.com/kadin-canta", accessories:"https://www.koton.com/kadin-aksesuar"},
     m:{base:"https://www.koton.com/erkek", pants:"https://www.koton.com/erkek-pantolon", jeans:"https://www.koton.com/erkek-kot-pantolon", shirt:"https://www.koton.com/erkek-gomlek", tshirt:"https://www.koton.com/erkek-tisort", jacket:"https://www.koton.com/erkek-ceket", coat:"https://www.koton.com/erkek-mont-kaban", sweatshirt:"https://www.koton.com/erkek-sweatshirt", underwear:"https://www.koton.com/erkek-ic-giyim", shoes:"https://www.koton.com/erkek-ayakkabi", bags:"https://www.koton.com/erkek-canta", accessories:"https://www.koton.com/erkek-aksesuar"},
     k:{girl:"https://www.koton.com/kiz-cocuk", boy:"https://www.koton.com/erkek-cocuk", baby:"https://www.koton.com/bebek"}},
    {id:"lcwaikiki", name:"LC Waikiki", domain:"lcwaikiki.com",
     w:{base:"https://www.lcwaikiki.com/tr-TR/kadin", dress:"https://www.lcwaikiki.com/tr-TR/kadin/elbise", pants:"https://www.lcwaikiki.com/tr-TR/kadin/pantolon", jeans:"https://www.lcwaikiki.com/tr-TR/kadin/kot-pantolon", tshirt:"https://www.lcwaikiki.com/tr-TR/kadin/tisort", blouse:"https://www.lcwaikiki.com/tr-TR/kadin/bluz", jacket:"https://www.lcwaikiki.com/tr-TR/kadin/ceket", coat:"https://www.lcwaikiki.com/tr-TR/kadin/mont", skirt:"https://www.lcwaikiki.com/tr-TR/kadin/etek", sweatshirt:"https://www.lcwaikiki.com/tr-TR/kadin/sweatshirt", underwear:"https://www.lcwaikiki.com/tr-TR/kadin/ic-giyim", shoes:"https://www.lcwaikiki.com/tr-TR/kadin/ayakkabi", bags:"https://www.lcwaikiki.com/tr-TR/kadin/canta", accessories:"https://www.lcwaikiki.com/tr-TR/kadin/aksesuar"},
     m:{base:"https://www.lcwaikiki.com/tr-TR/erkek", pants:"https://www.lcwaikiki.com/tr-TR/erkek/pantolon", jeans:"https://www.lcwaikiki.com/tr-TR/erkek/kot-pantolon", shirt:"https://www.lcwaikiki.com/tr-TR/erkek/gomlek", tshirt:"https://www.lcwaikiki.com/tr-TR/erkek/tisort", jacket:"https://www.lcwaikiki.com/tr-TR/erkek/ceket", coat:"https://www.lcwaikiki.com/tr-TR/erkek/mont", sweatshirt:"https://www.lcwaikiki.com/tr-TR/erkek/sweatshirt", underwear:"https://www.lcwaikiki.com/tr-TR/erkek/ic-giyim", shoes:"https://www.lcwaikiki.com/tr-TR/erkek/ayakkabi", bags:"https://www.lcwaikiki.com/tr-TR/erkek/canta", accessories:"https://www.lcwaikiki.com/tr-TR/erkek/aksesuar"},
     k:{girl:"https://www.lcwaikiki.com/tr-TR/kiz-cocuk", boy:"https://www.lcwaikiki.com/tr-TR/erkek-cocuk", teen_girl:"https://www.lcwaikiki.com/tr-TR/genc-kiz", teen_boy:"https://www.lcwaikiki.com/tr-TR/genc-erkek", baby:"https://www.lcwaikiki.com/tr-TR/bebek"}},
    {id:"defacto", name:"DeFacto", domain:"defacto.com.tr",
     w:{base:"https://www.defacto.com.tr/kadin", dress:"https://www.defacto.com.tr/kadin-elbise", pants:"https://www.defacto.com.tr/kadin-pantolon", jeans:"https://www.defacto.com.tr/kadin-kot-pantolon", tshirt:"https://www.defacto.com.tr/kadin-tisort", blouse:"https://www.defacto.com.tr/kadin-bluz", jacket:"https://www.defacto.com.tr/kadin-ceket", coat:"https://www.defacto.com.tr/kadin-mont", skirt:"https://www.defacto.com.tr/kadin-etek", sweatshirt:"https://www.defacto.com.tr/kadin-sweatshirt", underwear:"https://www.defacto.com.tr/kadin-ic-giyim", shoes:"https://www.defacto.com.tr/kadin-ayakkabi", bags:"https://www.defacto.com.tr/kadin-canta"},
     m:{base:"https://www.defacto.com.tr/erkek", pants:"https://www.defacto.com.tr/erkek-pantolon", jeans:"https://www.defacto.com.tr/erkek-kot-pantolon", shirt:"https://www.defacto.com.tr/erkek-gomlek", tshirt:"https://www.defacto.com.tr/erkek-tisort", jacket:"https://www.defacto.com.tr/erkek-ceket", coat:"https://www.defacto.com.tr/erkek-mont", sweatshirt:"https://www.defacto.com.tr/erkek-sweatshirt", underwear:"https://www.defacto.com.tr/erkek-ic-giyim", shoes:"https://www.defacto.com.tr/erkek-ayakkabi"},
     k:{girl:"https://www.defacto.com.tr/kiz-cocuk", boy:"https://www.defacto.com.tr/erkek-cocuk", teen_girl:"https://www.defacto.com.tr/genc-kiz", teen_boy:"https://www.defacto.com.tr/genc-erkek", baby:"https://www.defacto.com.tr/bebek"}},
    {id:"bershka", name:"Bershka TR", domain:"bershka.com",
     w:{base:"https://www.bershka.com/tr/tr/kadin-l1041.html", dress:"https://www.bershka.com/tr/tr/kadin-elbise-l1267.html", pants:"https://www.bershka.com/tr/tr/kadin-pantolon-l1266.html", jeans:"https://www.bershka.com/tr/tr/kadin-kot-l1266.html", tshirt:"https://www.bershka.com/tr/tr/kadin-tisort-l1266.html", sweatshirt:"https://www.bershka.com/tr/tr/kadin-sweatshirt-l1266.html", jacket:"https://www.bershka.com/tr/tr/kadin-ceket-l1266.html", shoes:"https://www.bershka.com/tr/tr/kadin-ayakkabi-l1251.html", accessories:"https://www.bershka.com/tr/tr/kadin-aksesuar-l1060.html"},
     m:{base:"https://www.bershka.com/tr/tr/erkek-l1040.html", pants:"https://www.bershka.com/tr/tr/erkek-pantolon-l1266.html", jeans:"https://www.bershka.com/tr/tr/erkek-kot-l1266.html", tshirt:"https://www.bershka.com/tr/tr/erkek-tisort-l1266.html", sweatshirt:"https://www.bershka.com/tr/tr/erkek-sweatshirt-l1266.html", jacket:"https://www.bershka.com/tr/tr/erkek-ceket-l1266.html", shoes:"https://www.bershka.com/tr/tr/erkek-ayakkabi-l1251.html", accessories:"https://www.bershka.com/tr/tr/erkek-aksesuar-l1060.html"}},
    {id:"pullandbear", name:"Pull&Bear TR", domain:"pullandbear.com",
     w:{base:"https://www.pullandbear.com/tr/tr/kadin-l1049.html", dress:"https://www.pullandbear.com/tr/tr/kadin-elbise-l1267.html", pants:"https://www.pullandbear.com/tr/tr/kadin-pantolon-l1266.html", jeans:"https://www.pullandbear.com/tr/tr/kadin-kot-l1266.html", tshirt:"https://www.pullandbear.com/tr/tr/kadin-tisort-l1266.html", sweatshirt:"https://www.pullandbear.com/tr/tr/kadin-sweatshirt-l1266.html", jacket:"https://www.pullandbear.com/tr/tr/kadin-ceket-l1266.html", shoes:"https://www.pullandbear.com/tr/tr/kadin-ayakkabi-l1251.html", accessories:"https://www.pullandbear.com/tr/tr/kadin-aksesuar-l1060.html"},
     m:{base:"https://www.pullandbear.com/tr/tr/erkek-l1048.html", pants:"https://www.pullandbear.com/tr/tr/erkek-pantolon-l1266.html", jeans:"https://www.pullandbear.com/tr/tr/erkek-kot-l1266.html", tshirt:"https://www.pullandbear.com/tr/tr/erkek-tisort-l1266.html", sweatshirt:"https://www.pullandbear.com/tr/tr/erkek-sweatshirt-l1266.html", jacket:"https://www.pullandbear.com/tr/tr/erkek-ceket-l1266.html", shoes:"https://www.pullandbear.com/tr/tr/erkek-ayakkabi-l1251.html"}},
    {id:"stradivarius", name:"Stradivarius TR", domain:"stradivarius.com",
     w:{base:"https://www.stradivarius.com/tr/tr/kadin-l1057.html", dress:"https://www.stradivarius.com/tr/tr/kadin-elbise-l1267.html", pants:"https://www.stradivarius.com/tr/tr/kadin-pantolon-l1266.html", jeans:"https://www.stradivarius.com/tr/tr/kadin-kot-l1266.html", tshirt:"https://www.stradivarius.com/tr/tr/kadin-tisort-l1266.html", skirt:"https://www.stradivarius.com/tr/tr/kadin-etek-l1266.html", jacket:"https://www.stradivarius.com/tr/tr/kadin-ceket-l1266.html", shoes:"https://www.stradivarius.com/tr/tr/kadin-ayakkabi-l1251.html", accessories:"https://www.stradivarius.com/tr/tr/kadin-aksesuar-l1060.html"}},
    {id:"massimodutti", name:"Massimo Dutti TR", domain:"massimodutti.com",
     w:{base:"https://www.massimodutti.com/tr/tr/kadin-l1045.html", dress:"https://www.massimodutti.com/tr/tr/kadin-elbise-l1267.html", pants:"https://www.massimodutti.com/tr/tr/kadin-pantolon-l1266.html", jacket:"https://www.massimodutti.com/tr/tr/kadin-ceket-l1266.html", shoes:"https://www.massimodutti.com/tr/tr/kadin-ayakkabi-l1251.html", accessories:"https://www.massimodutti.com/tr/tr/kadin-aksesuar-l1060.html"},
     m:{base:"https://www.massimodutti.com/tr/tr/erkek-l1044.html", pants:"https://www.massimodutti.com/tr/tr/erkek-pantolon-l1266.html", shirt:"https://www.massimodutti.com/tr/tr/erkek-gomlek-l1266.html", jacket:"https://www.massimodutti.com/tr/tr/erkek-ceket-l1266.html", suit:"https://www.massimodutti.com/tr/tr/erkek-takim-l1266.html", shoes:"https://www.massimodutti.com/tr/tr/erkek-ayakkabi-l1251.html", accessories:"https://www.massimodutti.com/tr/tr/erkek-aksesuar-l1060.html"}},
    {id:"guess", name:"Guess TR", domain:"guess.com",
     w:{clothing:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-apparel.html", bags:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-bags.html", shoes:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-shoes.html", watches:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-watches.html", accessories:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-accessories.html"},
     m:{clothing:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-apparel.html", bags:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-bags.html", shoes:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-shoes.html", watches:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-watches.html"}},
    {id:"tommy", name:"Tommy Hilfiger TR", domain:"tommy.com",
     w:{base:"https://tr.tommy.com/kadin", clothing:"https://tr.tommy.com/kadin/giyim", shoes:"https://tr.tommy.com/kadin/ayakkabi", bags:"https://tr.tommy.com/kadin/canta", accessories:"https://tr.tommy.com/kadin/aksesuar", perfume:"https://tr.tommy.com/kadin/parfum"},
     m:{base:"https://tr.tommy.com/erkek", clothing:"https://tr.tommy.com/erkek/giyim", shoes:"https://tr.tommy.com/erkek/ayakkabi", bags:"https://tr.tommy.com/erkek/canta", accessories:"https://tr.tommy.com/erkek/aksesuar", perfume:"https://tr.tommy.com/erkek/parfum"},
     k:{base:"https://tr.tommy.com/cocuk"}},
    {id:"calvinklein", name:"Calvin Klein TR", domain:"calvinklein.com",
     w:{clothing:"https://www.calvinklein.com/tr-TR/women/clothing", underwear:"https://www.calvinklein.com/tr-TR/women/underwear", bags:"https://www.calvinklein.com/tr-TR/women/handbags", shoes:"https://www.calvinklein.com/tr-TR/women/shoes", accessories:"https://www.calvinklein.com/tr-TR/women/accessories", perfume:"https://www.calvinklein.com/tr-TR/women/fragrance"},
     m:{clothing:"https://www.calvinklein.com/tr-TR/men/clothing", underwear:"https://www.calvinklein.com/tr-TR/men/underwear", bags:"https://www.calvinklein.com/tr-TR/men/bags", shoes:"https://www.calvinklein.com/tr-TR/men/shoes", accessories:"https://www.calvinklein.com/tr-TR/men/accessories", perfume:"https://www.calvinklein.com/tr-TR/men/fragrance"}},
    {id:"michaelkors", name:"Michael Kors TR", domain:"michaelkors.global",
     w:{base:"https://www.michaelkors.global/tr/en/women", bags:"https://www.michaelkors.global/tr/en/women/handbags/", shoes:"https://www.michaelkors.global/tr/en/women/shoes/", clothing:"https://www.michaelkors.global/tr/en/women/clothing/", watches:"https://www.michaelkors.global/tr/en/women/watches/", accessories:"https://www.michaelkors.global/tr/en/women/accessories/"},
     m:{base:"https://www.michaelkors.global/tr/en/men", bags:"https://www.michaelkors.global/tr/en/men/bags/", shoes:"https://www.michaelkors.global/tr/en/men/shoes/", clothing:"https://www.michaelkors.global/tr/en/men/clothing/", watches:"https://www.michaelkors.global/tr/en/men/watches/"}},
    {id:"ipekyol", name:"İpekyol", domain:"ipekyol.com.tr",
     w:{base:"https://www.ipekyol.com.tr/kadin", dress:"https://www.ipekyol.com.tr/kadin-elbise", pants:"https://www.ipekyol.com.tr/kadin-pantolon", blouse:"https://www.ipekyol.com.tr/kadin-bluz", jacket:"https://www.ipekyol.com.tr/kadin-ceket", skirt:"https://www.ipekyol.com.tr/kadin-etek", suit:"https://www.ipekyol.com.tr/kadin-takim", shoes:"https://www.ipekyol.com.tr/kadin-ayakkabi", bags:"https://www.ipekyol.com.tr/kadin-canta", accessories:"https://www.ipekyol.com.tr/kadin-aksesuar"}},
    {id:"vakko", name:"Vakko", domain:"vakko.com",
     w:{base:"https://www.vakko.com/kadin", clothing:"https://www.vakko.com/kadin/giyim", shoes:"https://www.vakko.com/kadin/ayakkabi", bags:"https://www.vakko.com/kadin/canta", accessories:"https://www.vakko.com/kadin/aksesuar"},
     m:{base:"https://www.vakko.com/erkek", clothing:"https://www.vakko.com/erkek/giyim", shoes:"https://www.vakko.com/erkek/ayakkabi", accessories:"https://www.vakko.com/erkek/aksesuar"}},
    {id:"kigili", name:"Kiğılı", domain:"kigili.com",
     m:{base:"https://www.kigili.com/erkek", suit:"https://www.kigili.com/erkek-takim-elbise", shirt:"https://www.kigili.com/erkek-gomlek", pants:"https://www.kigili.com/erkek-pantolon", jacket:"https://www.kigili.com/erkek-ceket", tshirt:"https://www.kigili.com/erkek-tisort", accessories:"https://www.kigili.com/erkek-aksesuar"}},
    {id:"colins", name:"Colin's", domain:"colins.com.tr",
     w:{jeans:"https://www.colins.com.tr/kadin-kot-pantolon", pants:"https://www.colins.com.tr/kadin-pantolon", tshirt:"https://www.colins.com.tr/kadin-tisort", sweatshirt:"https://www.colins.com.tr/kadin-sweatshirt"},
     m:{jeans:"https://www.colins.com.tr/erkek-kot-pantolon", pants:"https://www.colins.com.tr/erkek-pantolon", tshirt:"https://www.colins.com.tr/erkek-tisort", sweatshirt:"https://www.colins.com.tr/erkek-sweatshirt"},
     k:{jeans:"https://www.colins.com.tr/cocuk-kot-pantolon"}},
    {id:"uspoloassn", name:"US Polo Assn", domain:"uspoloassn.com.tr",
     w:{clothing:"https://www.uspoloassn.com.tr/kadin-giyim", shoes:"https://www.uspoloassn.com.tr/kadin-ayakkabi", accessories:"https://www.uspoloassn.com.tr/kadin-aksesuar"},
     m:{clothing:"https://www.uspoloassn.com.tr/erkek-giyim", shoes:"https://www.uspoloassn.com.tr/erkek-ayakkabi"},
     k:{clothing:"https://www.uspoloassn.com.tr/cocuk-giyim", shoes:"https://www.uspoloassn.com.tr/cocuk-ayakkabi"}},
    {id:"penti", name:"Penti", domain:"penti.com",
     w:{base:"https://www.penti.com/kadin", underwear:"https://www.penti.com/kadin-ic-giyim", socks:"https://www.penti.com/kadin-corap", tights:"https://www.penti.com/kadin-tayt", swimwear:"https://www.penti.com/kadin-mayo-bikini", pajamas:"https://www.penti.com/kadin-pijama"},
     m:{underwear:"https://www.penti.com/erkek-ic-giyim", socks:"https://www.penti.com/erkek-corap"},
     k:{underwear:"https://www.penti.com/cocuk-ic-giyim", socks:"https://www.penti.com/cocuk-corap"}},
    {id:"oysho", name:"Oysho TR", domain:"oysho.com",
     w:{base:"https://www.oysho.com/tr/tr/kadin-l1765.html", underwear:"https://www.oysho.com/tr/tr/kadin-ic-camasir-l1765.html", sport:"https://www.oysho.com/tr/tr/kadin-spor-l1765.html", swimwear:"https://www.oysho.com/tr/tr/kadin-mayo-l1765.html", pajamas:"https://www.oysho.com/tr/tr/kadin-pijama-l1765.html", accessories:"https://www.oysho.com/tr/tr/kadin-aksesuar-l1060.html"}},
    {id:"lefties", name:"Lefties TR", domain:"lefties.com",
     w:{base:"https://www.lefties.com/tr/en/woman", dress:"https://www.lefties.com/tr/en/woman/clothing/dresses-c1030267514.html", shirts:"https://www.lefties.com/tr/en/woman/clothing/shirts-c1030267513.html", tshirt:"https://www.lefties.com/tr/en/woman/clothing/t-shirts-c1030267505.html", pants:"https://www.lefties.com/tr/en/woman/clothing/trousers-c1030267528.html", jeans:"https://www.lefties.com/tr/en/woman/clothing/jeans-c1030267527.html", skirt:"https://www.lefties.com/tr/en/woman/clothing/skirts-c1030267516.html", shorts:"https://www.lefties.com/tr/en/woman/clothing/shorts-c1030267517.html", jacket:"https://www.lefties.com/tr/en/woman/clothing/jackets-c1030267532.html", blazer:"https://www.lefties.com/tr/en/woman/clothing/blazers-c1030267533.html", sweatshirt:"https://www.lefties.com/tr/en/woman/clothing/sweatshirts-c1030267521.html", knitwear:"https://www.lefties.com/tr/en/woman/clothing/knitwear-c1030267519.html", sport:"https://www.lefties.com/tr/en/woman/clothing/sportswear-c1030267536.html", leggings:"https://www.lefties.com/tr/en/woman/clothing/leggings-c1030267537.html", pajamas:"https://www.lefties.com/tr/en/woman/clothing/pyjamas-c1030267541.html", underwear:"https://www.lefties.com/tr/en/woman/clothing/underwear-c1030267540.html", swimwear:"https://www.lefties.com/tr/en/woman/clothing/swimwear-c1030267535.html", shoes:"https://www.lefties.com/tr/en/woman/shoes-c1030267545.html", sneakers:"https://www.lefties.com/tr/en/woman/shoes/sneakers-c1030272270.html", bags:"https://www.lefties.com/tr/en/woman/accessories/bags-c1030267557.html", jewelry:"https://www.lefties.com/tr/en/woman/accessories/jewellery-c1030267563.html", hats:"https://www.lefties.com/tr/en/woman/accessories/hats-c1030267561.html"},
     m:{base:"https://www.lefties.com/tr/en/man", tshirt:"https://www.lefties.com/tr/en/man/clothing/t-shirts-c1030267571.html", shirt:"https://www.lefties.com/tr/en/man/clothing/shirts-c1030267572.html", pants:"https://www.lefties.com/tr/en/man/clothing/trousers-c1030267575.html", jeans:"https://www.lefties.com/tr/en/man/clothing/jeans-c1030267574.html", shorts:"https://www.lefties.com/tr/en/man/clothing/shorts-c1030267576.html", jacket:"https://www.lefties.com/tr/en/man/clothing/jackets-|-coats-c1030267577.html", sweatshirt:"https://www.lefties.com/tr/en/man/clothing/sweatshirts-c1030267580.html", knitwear:"https://www.lefties.com/tr/en/man/clothing/knitwear-c1030267582.html", sport:"https://www.lefties.com/tr/en/man/clothing/sportswear-c1030267585.html", underwear:"https://www.lefties.com/tr/en/man/clothing/underwear-c1030267589.html", shoes:"https://www.lefties.com/tr/en/man/shoes-c1030267592.html"},
     k:{girl:"https://www.lefties.com/tr/en/kids/girl/clothing-c1030267605.html", boy:"https://www.lefties.com/tr/en/kids/boy/clothing-c1030267620.html", baby_girl:"https://www.lefties.com/tr/en/kids/baby-girl-c1030267638.html", baby_boy:"https://www.lefties.com/tr/en/kids/baby-boy-c1030267646.html", girl_shoes:"https://www.lefties.com/tr/en/kids/girl/footwear/shoes-c1030272335.html", boy_shoes:"https://www.lefties.com/tr/en/kids/boy/footwear/shoes-c1030272391.html"}},
    {id:"mavi", name:"Mavi", domain:"mavi.com",
     w:{base:"https://www.mavi.com/kadin", jeans:"https://www.mavi.com/kadin-kot-pantolon", pants:"https://www.mavi.com/kadin-pantolon", tshirt:"https://www.mavi.com/kadin-tisort", dress:"https://www.mavi.com/kadin-elbise", sweatshirt:"https://www.mavi.com/kadin-sweatshirt"},
     m:{base:"https://www.mavi.com/erkek", jeans:"https://www.mavi.com/erkek-kot-pantolon", pants:"https://www.mavi.com/erkek-pantolon", tshirt:"https://www.mavi.com/erkek-tisort", sweatshirt:"https://www.mavi.com/erkek-sweatshirt"}},
    {id:"jackjones", name:"Jack & Jones TR", domain:"jackjones.com",
     m:{base:"https://www.jackjones.com/tr-TR/erkek", jeans:"https://www.jackjones.com/tr-TR/erkek-kot-pantolon", pants:"https://www.jackjones.com/tr-TR/erkek-pantolon", shirt:"https://www.jackjones.com/tr-TR/erkek-gomlek", tshirt:"https://www.jackjones.com/tr-TR/erkek-tisort", jacket:"https://www.jackjones.com/tr-TR/erkek-ceket", sweatshirt:"https://www.jackjones.com/tr-TR/erkek-sweatshirt"}},
    {id:"avva", name:"Avva", domain:"avva.com.tr",
     m:{base:"https://www.avva.com.tr/erkek", shirt:"https://www.avva.com.tr/erkek-gomlek", pants:"https://www.avva.com.tr/erkek-pantolon", suit:"https://www.avva.com.tr/erkek-takim-elbise", jacket:"https://www.avva.com.tr/erkek-ceket", tshirt:"https://www.avva.com.tr/erkek-tisort"}},
    {id:"levis", name:"Levi's TR", domain:"levis.com",
     w:{jeans:"https://www.levis.com/tr-TR/kadin-kot-pantolon", pants:"https://www.levis.com/tr-TR/kadin-pantolon", tshirt:"https://www.levis.com/tr-TR/kadin-tisort", sweatshirt:"https://www.levis.com/tr-TR/kadin-sweatshirt"},
     m:{jeans:"https://www.levis.com/tr-TR/erkek-kot-pantolon", pants:"https://www.levis.com/tr-TR/erkek-pantolon", tshirt:"https://www.levis.com/tr-TR/erkek-tisort", sweatshirt:"https://www.levis.com/tr-TR/erkek-sweatshirt"}},
    {id:"ltb", name:"LTB", domain:"ltb.com.tr",
     w:{jeans:"https://www.ltb.com.tr/kadin-kot-pantolon", pants:"https://www.ltb.com.tr/kadin-pantolon", tshirt:"https://www.ltb.com.tr/kadin-tisort"},
     m:{jeans:"https://www.ltb.com.tr/erkek-kot-pantolon", pants:"https://www.ltb.com.tr/erkek-pantolon", tshirt:"https://www.ltb.com.tr/erkek-tisort"}},
    {id:"trendyolmilla", name:"Trendyol Milla", domain:"milla.com.tr",
     w:{base:"https://www.milla.com.tr", dress:"https://www.milla.com.tr/elbise", pants:"https://www.milla.com.tr/pantolon", blouse:"https://www.milla.com.tr/bluz", jacket:"https://www.milla.com.tr/ceket", skirt:"https://www.milla.com.tr/etek", shoes:"https://www.milla.com.tr/ayakkabi", accessories:"https://www.milla.com.tr/aksesuar"}}
  ],
  sports: [
    {id:"adidas", name:"Adidas TR", domain:"adidas.com.tr",
     w:{base:"https://www.adidas.com.tr/kadin", tshirt:"https://www.adidas.com.tr/kadin-tisort", pants:"https://www.adidas.com.tr/kadin-tayt-ve-pantolon", jacket:"https://www.adidas.com.tr/kadin-ceket", sweatshirt:"https://www.adidas.com.tr/kadin-hoodie-sweatshirt", shorts:"https://www.adidas.com.tr/kadin-sort", bra:"https://www.adidas.com.tr/kadin-spor-sutyeni", shoes:"https://www.adidas.com.tr/kadin-ayakkabi", bags:"https://www.adidas.com.tr/kadin-canta"},
     m:{base:"https://www.adidas.com.tr/erkek", tshirt:"https://www.adidas.com.tr/erkek-tisort", pants:"https://www.adidas.com.tr/erkek-pantolon", jacket:"https://www.adidas.com.tr/erkek-ceket", sweatshirt:"https://www.adidas.com.tr/erkek-hoodie-sweatshirt", shorts:"https://www.adidas.com.tr/erkek-sort", shoes:"https://www.adidas.com.tr/erkek-ayakkabi", football_shoes:"https://www.adidas.com.tr/erkek-futbol-ayakkabisi"},
     k:{clothing:"https://www.adidas.com.tr/cocuk-giyim", shoes:"https://www.adidas.com.tr/cocuk-ayakkabi"}},
    {id:"puma", name:"Puma TR", domain:"puma.com",
     w:{clothing:"https://tr.puma.com/kadin/giyim", shoes:"https://tr.puma.com/kadin/ayakkabi", accessories:"https://tr.puma.com/kadin/aksesuar"},
     m:{clothing:"https://tr.puma.com/erkek/giyim", shoes:"https://tr.puma.com/erkek/ayakkabi", accessories:"https://tr.puma.com/erkek/aksesuar"},
     k:{clothing:"https://tr.puma.com/cocuk/giyim", shoes:"https://tr.puma.com/cocuk/ayakkabi"}},
    {id:"reebok", name:"Reebok TR", domain:"reebok.com",
     w:{clothing:"https://www.reebok.com.tr/kadin-giyim", shoes:"https://www.reebok.com.tr/kadin-ayakkabi"},
     m:{clothing:"https://www.reebok.com.tr/erkek-giyim", shoes:"https://www.reebok.com.tr/erkek-ayakkabi"}},
    {id:"newbalance", name:"New Balance TR", domain:"newbalance.com.tr",
     w:{shoes:"https://www.newbalance.com.tr/kadin/ayakkabi", clothing:"https://www.newbalance.com.tr/kadin/giyim"},
     m:{shoes:"https://www.newbalance.com.tr/erkek/ayakkabi", clothing:"https://www.newbalance.com.tr/erkek/giyim"},
     k:{shoes:"https://www.newbalance.com.tr/cocuk/ayakkabi"}},
    {id:"decathlon", name:"Decathlon TR", domain:"decathlon.com.tr",
     w:{clothing:"https://www.decathlon.com.tr/kadin-spor-giyim", shoes:"https://www.decathlon.com.tr/kadin-spor-ayakkabi"},
     m:{clothing:"https://www.decathlon.com.tr/erkek-spor-giyim", shoes:"https://www.decathlon.com.tr/erkek-spor-ayakkabi"},
     k:{clothing:"https://www.decathlon.com.tr/cocuk-spor-giyim", shoes:"https://www.decathlon.com.tr/cocuk-spor-ayakkabi"},
     equipment:"https://www.decathlon.com.tr/spor-malzemeleri"},
    {id:"underarmour", name:"Under Armour TR", domain:"underarmour.com",
     w:{clothing:"https://www.underarmour.com/tr-TR/womens-clothing", shoes:"https://www.underarmour.com/tr-TR/womens-shoes"},
     m:{clothing:"https://www.underarmour.com/tr-TR/mens-clothing", shoes:"https://www.underarmour.com/tr-TR/mens-shoes"}},
    {id:"hummel", name:"Hummel TR", domain:"hummel.net",
     w:{clothing:"https://www.hummel.net/tr-TR/kadin-giyim", shoes:"https://www.hummel.net/tr-TR/kadin-ayakkabi"},
     m:{clothing:"https://www.hummel.net/tr-TR/erkek-giyim", shoes:"https://www.hummel.net/tr-TR/erkek-ayakkabi"},
     k:{clothing:"https://www.hummel.net/tr-TR/cocuk-giyim", shoes:"https://www.hummel.net/tr-TR/cocuk-ayakkabi"}},
    {id:"thenorthface", name:"The North Face TR", domain:"thenorthface.com",
     w:{clothing:"https://www.thenorthface.com/tr-TR/kadin-giyim", shoes:"https://www.thenorthface.com/tr-TR/kadin-ayakkabi", bags:"https://www.thenorthface.com/tr-TR/kadin-canta"},
     m:{clothing:"https://www.thenorthface.com/tr-TR/erkek-giyim", shoes:"https://www.thenorthface.com/tr-TR/erkek-ayakkabi", bags:"https://www.thenorthface.com/tr-TR/erkek-canta"}},
    {id:"converse", name:"Converse TR", domain:"converse.com",
     w:{shoes:"https://www.converse.com.tr/kadin-ayakkabi", clothing:"https://www.converse.com.tr/kadin-giyim"},
     m:{shoes:"https://www.converse.com.tr/erkek-ayakkabi", clothing:"https://www.converse.com.tr/erkek-giyim"},
     k:{shoes:"https://www.converse.com.tr/cocuk-ayakkabi"}},
    {id:"vans", name:"Vans TR", domain:"vans.com",
     w:{shoes:"https://www.vans.com.tr/kadin/ayakkabi", clothing:"https://www.vans.com.tr/kadin/giyim"},
     m:{shoes:"https://www.vans.com.tr/erkek/ayakkabi", clothing:"https://www.vans.com.tr/erkek/giyim"}},
    {id:"skechers", name:"Skechers TR", domain:"skechers.com.tr",
     w:{shoes:"https://www.skechers.com.tr/kadin-ayakkabi"},
     m:{shoes:"https://www.skechers.com.tr/erkek-ayakkabi"},
     k:{shoes:"https://www.skechers.com.tr/cocuk-ayakkabi"}}
  ],
  shoes: [
    {id:"flo", name:"Flo", domain:"flo.com.tr",
     w:{shoes:"https://www.flo.com.tr/kadin-ayakkabi"},
     m:{shoes:"https://www.flo.com.tr/erkek-ayakkabi"},
     k:{shoes:"https://www.flo.com.tr/cocuk-ayakkabi"},
     sport:{shoes:"https://www.flo.com.tr/spor-ayakkabi"}},
    {id:"aldo", name:"Aldo TR", domain:"aldoshoes.com",
     w:{shoes:"https://www.aldoshoes.com/tr-TR/women/shoes", bags:"https://www.aldoshoes.com/tr-TR/women/handbags", accessories:"https://www.aldoshoes.com/tr-TR/women/accessories"},
     m:{shoes:"https://www.aldoshoes.com/tr-TR/men/shoes"}},
    {id:"derimod", name:"Derimod", domain:"derimod.com.tr",
     w:{shoes:"https://www.derimod.com.tr/kadin-ayakkabi", bags:"https://www.derimod.com.tr/kadin-canta", belts:"https://www.derimod.com.tr/kadin-kemer", wallets:"https://www.derimod.com.tr/kadin-cuzdan"},
     m:{shoes:"https://www.derimod.com.tr/erkek-ayakkabi", bags:"https://www.derimod.com.tr/erkek-canta", belts:"https://www.derimod.com.tr/erkek-kemer", wallets:"https://www.derimod.com.tr/erkek-cuzdan"}},
    {id:"elle", name:"Elle TR", domain:"elle.com.tr",
     w:{shoes:"https://www.elle.com.tr/kadin-ayakkabi", bags:"https://www.elle.com.tr/kadin-canta", accessories:"https://www.elle.com.tr/kadin-aksesuar"}}
  ],
  beauty: [
    {id:"gratis", name:"Gratis", domain:"gratis.com",
     cats:{face:"https://www.gratis.com/makyaj/yuz-makyaji", eye:"https://www.gratis.com/makyaj/goz-makyaji", lips:"https://www.gratis.com/makyaj/dudak-urunleri", nails:"https://www.gratis.com/makyaj/oje-ve-tirnak-bakimi", skincare:"https://www.gratis.com/cilt-bakimi", haircare:"https://www.gratis.com/sac-bakimi", bodycare:"https://www.gratis.com/vucut-bakimi", perfume_w:"https://www.gratis.com/parfum/kadin-parfumu", perfume_m:"https://www.gratis.com/parfum/erkek-parfumu", men:"https://www.gratis.com/erkek-bakim"}},
    {id:"rossmann", name:"Rossmann TR", domain:"rossmann.com.tr",
     cats:{makeup:"https://www.rossmann.com.tr/makyaj", skincare:"https://www.rossmann.com.tr/cilt-bakimi", haircare:"https://www.rossmann.com.tr/sac-bakimi", bodycare:"https://www.rossmann.com.tr/kisisel-bakim", perfume:"https://www.rossmann.com.tr/parfum"}},
    {id:"watsons", name:"Watsons TR", domain:"watsons.com.tr",
     cats:{makeup:"https://www.watsons.com.tr/makyaj", skincare:"https://www.watsons.com.tr/cilt-bakimi", haircare:"https://www.watsons.com.tr/sac-bakimi", bodycare:"https://www.watsons.com.tr/kisisel-bakim", perfume:"https://www.watsons.com.tr/parfum"}},
    {id:"sephora", name:"Sephora TR", domain:"sephora.com.tr",
     cats:{face:"https://www.sephora.com.tr/yuz-makyaj", eye:"https://www.sephora.com.tr/goz-makyaj", lips:"https://www.sephora.com.tr/dudak-urunleri", skincare:"https://www.sephora.com.tr/cilt-bakimi", haircare:"https://www.sephora.com.tr/sac-bakimi", perfume:"https://www.sephora.com.tr/parfum", men:"https://www.sephora.com.tr/erkek-bakim"}},
    {id:"flormar", name:"Flormar", domain:"flormar.com",
     cats:{face:"https://www.flormar.com/yuz", eye:"https://www.flormar.com/goz", lips:"https://www.flormar.com/dudak", nails:"https://www.flormar.com/tirnak", skincare:"https://www.flormar.com/cilt-bakimi"}},
    {id:"goldenrose", name:"Golden Rose", domain:"goldenrose.com.tr",
     cats:{face:"https://www.goldenrose.com.tr/yuz-makyaji", eye:"https://www.goldenrose.com.tr/goz-makyaji", lips:"https://www.goldenrose.com.tr/dudak-urunleri", nails:"https://www.goldenrose.com.tr/oje", skincare:"https://www.goldenrose.com.tr/cilt-bakimi"}},
    {id:"mac", name:"MAC TR", domain:"maccosmetics.com",
     cats:{face:"https://www.maccosmetics.com/tr-TR/collections/face", eye:"https://www.maccosmetics.com/tr-TR/collections/eyes", lips:"https://www.maccosmetics.com/tr-TR/collections/lips", skincare:"https://www.maccosmetics.com/tr-TR/collections/skincare"}},
    {id:"kiko", name:"Kiko Milano TR", domain:"kikocosmetics.com",
     cats:{face:"https://www.kikocosmetics.com/tr-TR/c/face", eye:"https://www.kikocosmetics.com/tr-TR/c/eyes", lips:"https://www.kikocosmetics.com/tr-TR/c/lips", nails:"https://www.kikocosmetics.com/tr-TR/c/nails", skincare:"https://www.kikocosmetics.com/tr-TR/c/skincare"}},
    {id:"eveshop", name:"eveShop TR", domain:"eveshop.com.tr",
     cats:{makeup:"https://www.eveshop.com.tr/makyaj", skincare:"https://www.eveshop.com.tr/cilt-bakimi", perfume:"https://www.eveshop.com.tr/parfum"}},
    {id:"loreal", name:"L'Oréal TR", domain:"loreal-paris.com.tr",
     cats:{makeup:"https://www.loreal-paris.com.tr/makyaj", skincare:"https://www.loreal-paris.com.tr/cilt-bakimi", haircare:"https://www.loreal-paris.com.tr/sac-bakimi", haircolor:"https://www.loreal-paris.com.tr/sac-boyasi"}},
    {id:"clinique", name:"Clinique TR", domain:"clinique.com",
     cats:{skincare:"https://www.clinique.com/tr/skincare", makeup:"https://www.clinique.com/tr/makeup", perfume:"https://www.clinique.com/tr/fragrance", men:"https://www.clinique.com/tr/mens"}},
    {id:"esteelauder", name:"Estée Lauder TR", domain:"esteelauder.com",
     cats:{skincare:"https://www.esteelauder.com/tr-TR/skincare", makeup:"https://www.esteelauder.com/tr-TR/makeup", perfume:"https://www.esteelauder.com/tr-TR/fragrance"}},
    {id:"lancome", name:"Lancôme TR", domain:"lancome.com",
     cats:{skincare:"https://www.lancome.com/tr-TR/skincare", makeup:"https://www.lancome.com/tr-TR/makeup", perfume:"https://www.lancome.com/tr-TR/fragrance"}}
  ],
  home: [
    {id:"karaca", name:"Karaca", domain:"karaca.com",
     cats:{kitchen:"https://www.karaca.com/mutfak", dining:"https://www.karaca.com/sofra", bedroom:"https://www.karaca.com/yatak-odasi", bathroom:"https://www.karaca.com/banyo", decor:"https://www.karaca.com/dekor", cookware:"https://www.karaca.com/tencere-tava", mugs:"https://www.karaca.com/kupa-ve-fincan"}},
    {id:"korkmaz", name:"Korkmaz", domain:"korkmaz.com.tr",
     cats:{cookware:"https://www.korkmaz.com.tr/tencere-tava", electrical:"https://www.korkmaz.com.tr/elektrikli-urunler", knives:"https://www.korkmaz.com.tr/bicak", kitchen:"https://www.korkmaz.com.tr/mutfak-urunleri"}},
    {id:"tefal", name:"Tefal TR", domain:"tefal.com",
     cats:{pans:"https://www.tefal.com/tr-TR/cooking/pans", pots:"https://www.tefal.com/tr-TR/cooking/pots", irons:"https://www.tefal.com/tr-TR/garment-care/irons", kettles:"https://www.tefal.com/tr-TR/kitchen-electrics/kettles"}},
    {id:"englishhome", name:"English Home", domain:"englishhome.com",
     cats:{bedding:"https://www.englishhome.com/nevresim-takimi", curtains:"https://www.englishhome.com/perde", towels:"https://www.englishhome.com/havlu", bathroom:"https://www.englishhome.com/banyo", kitchen:"https://www.englishhome.com/mutfak", decor:"https://www.englishhome.com/dekorasyon", rugs:"https://www.englishhome.com/hali"}},
    {id:"madamecoco", name:"Madame Coco", domain:"madamecoco.com.tr",
     cats:{bedding:"https://www.madamecoco.com.tr/nevresim-takimi", towels:"https://www.madamecoco.com.tr/havlu", decor:"https://www.madamecoco.com.tr/dekorasyon", kitchen:"https://www.madamecoco.com.tr/mutfak", curtains:"https://www.madamecoco.com.tr/perde"}},
    {id:"bellamaison", name:"Bellamaison", domain:"bellamaison.com.tr",
     cats:{bedding:"https://www.bellamaison.com.tr/nevresim-takimi", curtains:"https://www.bellamaison.com.tr/perde", towels:"https://www.bellamaison.com.tr/havlu", decor:"https://www.bellamaison.com.tr/dekorasyon", rugs:"https://www.bellamaison.com.tr/hali"}},
    {id:"yatas", name:"Yataş", domain:"yatas.com.tr",
     cats:{mattress:"https://www.yatas.com.tr/yatak-ve-baza", bedding:"https://www.yatas.com.tr/nevresim", pillows:"https://www.yatas.com.tr/yastik", furniture:"https://www.yatas.com.tr/koltuk"}},
    {id:"ozdilek", name:"Özdilek", domain:"ozdilek.com.tr",
     cats:{mattress:"https://www.ozdilek.com.tr/yatak", bedding:"https://www.ozdilek.com.tr/nevresim", furniture:"https://www.ozdilek.com.tr/mobilya", decor:"https://www.ozdilek.com.tr/dekorasyon", curtains:"https://www.ozdilek.com.tr/perde"}}
  ],
  kids: [
    {id:"chicco", name:"Chicco TR", domain:"chicco.com.tr",
     cats:{strollers:"https://www.chicco.com.tr/cocuk-arabasi", carseats:"https://www.chicco.com.tr/oto-koltugu", clothing:"https://www.chicco.com.tr/bebek-giyim", feeding:"https://www.chicco.com.tr/besleme", toys:"https://www.chicco.com.tr/oyuncak", care:"https://www.chicco.com.tr/bebek-bakimi"}},
    {id:"ebebek", name:"Ebebek", domain:"ebebek.com",
     cats:{girl:"https://www.ebebek.com/kiz-cocuk-giyim", boy:"https://www.ebebek.com/erkek-cocuk-giyim", baby:"https://www.ebebek.com/bebek-giyim", shoes:"https://www.ebebek.com/cocuk-ayakkabi", toys:"https://www.ebebek.com/oyuncak", strollers:"https://www.ebebek.com/bebek-arabasi", feeding:"https://www.ebebek.com/besleme", care:"https://www.ebebek.com/bebek-bakimi"}}
  ]
};


export const CATS = {
  clothing: {
    label:"👗 پوشاک",
    subs: {
      dress:    {fa:"پیراهن / ماکسی", genders:["w","k"]},
      pants:    {fa:"شلوار",           genders:["w","m","k"]},
      jeans:    {fa:"جین",             genders:["w","m","k"]},
      tshirt:   {fa:"تیشرت",           genders:["w","m","k"]},
      blouse:   {fa:"بلوز / پیراهن",   genders:["w"]},
      shirt:    {fa:"پیراهن مردانه",   genders:["m"]},
      jacket:   {fa:"کت / کاپشن",      genders:["w","m"]},
      coat:     {fa:"پالتو / مانتو",   genders:["w","m"]},
      skirt:    {fa:"دامن",            genders:["w"]},
      sweatshirt:{fa:"سوییشرت / هودی", genders:["w","m"]},
      suit:     {fa:"ست / کت‌شلوار",   genders:["w","m"]},
      underwear:{fa:"لباس زیر",        genders:["w","m","k"]},
      swimwear: {fa:"لباس شنا / بیکینی",genders:["w"]},
      pajamas:  {fa:"پیژامه",          genders:["w","m"]},
      leggings: {fa:"لگ",              genders:["w"]},
      sport:    {fa:"لباس ورزشی",      genders:["w","m"]},
      bra:      {fa:"سوتین ورزشی",     genders:["w"]}
    }
  },
  shoes: {
    label:"👠 کفش",
    subs: {
      shoes:    {fa:"کفش",             genders:["w","m","k"]},
      sneakers: {fa:"اسنیکر / کتونی",  genders:["w","m","k"]},
      boots:    {fa:"بوت",             genders:["w","m"]},
      sandals:  {fa:"صندل",            genders:["w","m"]},
      heels:    {fa:"پاشنه‌دار",        genders:["w"]},
      sport_shoes:{fa:"کفش ورزشی",    genders:["w","m","k"]}
    }
  },
  bags: {
    label:"👜 کیف و اکسسوری",
    subs: {
      bags:     {fa:"کیف",             genders:["w","m"]},
      handbags: {fa:"کیف دستی",        genders:["w"]},
      backpack: {fa:"کوله‌پشتی",        genders:["w","m"]},
      wallets:  {fa:"کیف پول",         genders:["w","m"]},
      belts:    {fa:"کمربند",           genders:["w","m"]},
      jewelry:  {fa:"جواهرات",         genders:["w"]},
      scarves:  {fa:"شال / روسری",     genders:["w"]},
      sunglasses:{fa:"عینک آفتابی",    genders:["w","m"]},
      watches:  {fa:"ساعت",            genders:["w","m"]},
      accessories:{fa:"اکسسوری",       genders:["w","m"]}
    }
  },
  sports: {
    label:"🏃 ورزشی",
    subs: {
      sport_clothing:{fa:"پوشاک ورزشی",genders:["w","m","k"]},
      sport_shoes: {fa:"کفش ورزشی",    genders:["w","m","k"]},
      equipment:   {fa:"تجهیزات",      genders:["all"]}
    }
  },
  beauty: {
    label:"💄 آرایشی",
    subs: {
      face:     {fa:"آرایش صورت",      genders:["all"]},
      eye:      {fa:"آرایش چشم",       genders:["all"]},
      lips:     {fa:"آرایش لب",        genders:["all"]},
      nails:    {fa:"ناخن",            genders:["all"]},
      skincare: {fa:"مراقبت پوست",     genders:["all"]},
      haircare: {fa:"مراقبت مو",       genders:["all"]},
      bodycare: {fa:"مراقبت بدن",      genders:["all"]},
      perfume:  {fa:"عطر",             genders:["all"]},
      makeup:   {fa:"آرایشی",         genders:["all"]},
      men:      {fa:"مراقبت مردانه",   genders:["all"]}
    }
  },
  home: {
    label:"🏠 خانه",
    subs: {
      kitchen:  {fa:"آشپزخانه",        genders:["all"]},
      bedding:  {fa:"ملحفه و روتختی",  genders:["all"]},
      bathroom: {fa:"حمام",            genders:["all"]},
      decor:    {fa:"دکوراسیون",       genders:["all"]},
      dining:   {fa:"ظروف غذاخوری",   genders:["all"]},
      cookware: {fa:"قابلمه و تابه",   genders:["all"]},
      curtains: {fa:"پرده",            genders:["all"]},
      towels:   {fa:"حوله",            genders:["all"]},
      rugs:     {fa:"فرش",             genders:["all"]},
      furniture:{fa:"مبلمان / تشک",   genders:["all"]},
      mattress: {fa:"تشک",             genders:["all"]},
      electrical:{fa:"لوازم برقی",     genders:["all"]}
    }
  },
  kids_spec: {
    label:"👶 کودک و نوزاد",
    subs: {
      girl:     {fa:"لباس دختر",       genders:["all"]},
      boy:      {fa:"لباس پسر",        genders:["all"]},
      baby:     {fa:"لباس نوزاد",      genders:["all"]},
      shoes:    {fa:"کفش بچگانه",      genders:["all"]},
      toys:     {fa:"اسباب‌بازی",      genders:["all"]},
      strollers:{fa:"کالسکه",          genders:["all"]},
      feeding:  {fa:"تغذیه",           genders:["all"]},
      care:     {fa:"مراقبت نوزاد",    genders:["all"]}
    }
  }
};

// Map: which brands have which sub-category links
// Format: brandId -> {subKey: url}
export const CAT_LINKS = {
  // CLOTHING
  zara: {
    dress:{w:"https://www.zara.com/tr/tr/kadin-elbiseler-l1066.html", k:"https://www.zara.com/tr/tr/kiz-cocuk-elbise-l10803.html"},
    pants:{w:"https://www.zara.com/tr/tr/kadin-pantolonlar-l1335.html", m:"https://www.zara.com/tr/tr/erkek-pantolonlar-l1328.html", k:"https://www.zara.com/tr/tr/kiz-cocuk-pantolon-l10804.html"},
    jeans:{w:"https://www.zara.com/tr/tr/kadin-kot-l1335.html", m:"https://www.zara.com/tr/tr/erkek-kot-l1328.html"},
    tshirt:{w:"https://www.zara.com/tr/tr/kadin-tisort-l1323.html", m:"https://www.zara.com/tr/tr/erkek-tisort-l1327.html", k:"https://www.zara.com/tr/tr/kiz-cocuk-tisort-l10802.html"},
    blouse:{w:"https://www.zara.com/tr/tr/kadin-bluzlar-gomlek-l1323.html"},
    shirt:{m:"https://www.zara.com/tr/tr/erkek-gomlek-l1327.html"},
    jacket:{w:"https://www.zara.com/tr/tr/kadin-ceketler-l1336.html", m:"https://www.zara.com/tr/tr/erkek-ceket-l1329.html"},
    coat:{w:"https://www.zara.com/tr/tr/kadin-montlar-l1109.html", m:"https://www.zara.com/tr/tr/erkek-mont-l1110.html"},
    skirt:{w:"https://www.zara.com/tr/tr/kadin-etekler-l1068.html"},
    sweatshirt:{w:"https://www.zara.com/tr/tr/kadin-sweatshirt-l1323.html", m:"https://www.zara.com/tr/tr/erkek-sweatshirt-l1327.html"},
    suit:{w:"https://www.zara.com/tr/tr/kadin-takim-l1437.html", m:"https://www.zara.com/tr/tr/erkek-takim-l1340.html"},
    underwear:{w:"https://www.zara.com/tr/tr/kadin-ic-camasir-l1104.html", m:"https://www.zara.com/tr/tr/erkek-ic-camasir-l1107.html"},
    swimwear:{w:"https://www.zara.com/tr/tr/kadin-mayo-bikini-l1104.html"},
    shoes:{w:"https://www.zara.com/tr/tr/kadin-ayakkabi-l1251.html", m:"https://www.zara.com/tr/tr/erkek-ayakkabi-l1362.html", k:"https://www.zara.com/tr/tr/kiz-cocuk-ayakkabi-l10811.html"},
    bags:{w:"https://www.zara.com/tr/tr/kadin-canta-l1252.html", m:"https://www.zara.com/tr/tr/erkek-canta-l1361.html"},
    accessories:{w:"https://www.zara.com/tr/tr/kadin-aksesuar-l1060.html", m:"https://www.zara.com/tr/tr/erkek-aksesuar-l1360.html"},
    girl:{k:"https://www.zara.com/tr/tr/kiz-bebek-kiz-cocuk-l10801.html"},
    boy:{k:"https://www.zara.com/tr/tr/erkek-bebek-erkek-cocuk-l10901.html"},
    baby:{k:"https://www.zara.com/tr/tr/kiz-bebek-kiz-cocuk-l10801.html"},
    kitchen:{all:"https://www.zara.com/tr/en/home-mkt2085.html"},
    bedding:{all:"https://www.zara.com/tr/en/home-bedroom-l2087.html"},
    decor:{all:"https://www.zara.com/tr/en/home-decoration-mkt6612.html"},
    furniture:{all:"https://www.zara.com/tr/en/home-furniture-l6181.html"}
  },
  mango: {
    dress:{w:"https://shop.mango.com/tr/tr/c/kadin/elbise-ve-tulum_5f4ab0b9", k:"https://shop.mango.com/tr/tr/c/cocuk/kiz-cocuk/elbise-ve-tulum_f3b158de"},
    pants:{w:"https://shop.mango.com/tr/tr/c/kadin/pantolon_b126cc9c", m:"https://shop.mango.com/tr/tr/c/erkek/pantolon_b126cc9c", k:"https://shop.mango.com/tr/tr/c/cocuk/erkek-cocuk/pantolon_e89704ef"},
    jeans:{w:"https://shop.mango.com/tr/tr/c/kadin/jean_3e4e98c0", m:"https://shop.mango.com/tr/tr/c/erkek/jean_3e4e98c0"},
    blouse:{w:"https://shop.mango.com/tr/tr/c/kadin/gomlek-ve-bluz_a5cb7e81"},
    shirt:{m:"https://shop.mango.com/tr/tr/c/erkek/gomlek_a5cb7e81"},
    tshirt:{w:"https://shop.mango.com/tr/tr/c/kadin/tisort_3e3c0fca", m:"https://shop.mango.com/tr/tr/c/erkek/tisort_3e3c0fca", k:"https://shop.mango.com/tr/tr/c/cocuk/erkek-cocuk/tisort_e89704ef"},
    jacket:{w:"https://shop.mango.com/tr/tr/c/kadin/ceket_f6a6e1d8", m:"https://shop.mango.com/tr/tr/c/erkek/ceket_f6a6e1d8"},
    coat:{w:"https://shop.mango.com/tr/tr/c/kadin/palto_3e3c0fca", m:"https://shop.mango.com/tr/tr/c/erkek/mont_3e3c0fca"},
    skirt:{w:"https://shop.mango.com/tr/tr/c/kadin/etek_a5cb7e81"},
    sweatshirt:{w:"https://shop.mango.com/tr/tr/c/kadin/sweatshirt_3e3c0fca", m:"https://shop.mango.com/tr/tr/c/erkek/sweatshirt_3e3c0fca"},
    suit:{w:"https://shop.mango.com/tr/tr/c/kadin/blazer-ceket_a5cb7e81", m:"https://shop.mango.com/tr/tr/c/erkek/takim_a5cb7e81"},
    shoes:{w:"https://shop.mango.com/tr/tr/c/kadin/ayakkabi_e38a534b", m:"https://shop.mango.com/tr/tr/c/erkek/ayakkabi_e38a534b", k:"https://shop.mango.com/tr/tr/c/cocuk/kiz-cocuk/ayakkabi_f3b158de"},
    bags:{w:"https://shop.mango.com/tr/tr/c/kadin/canta_e38a534b", m:"https://shop.mango.com/tr/tr/c/erkek/canta_e38a534b"},
    handbags:{w:"https://shop.mango.com/tr/tr/c/kadin/canta_e38a534b"},
    jewelry:{w:"https://shop.mango.com/tr/tr/c/kadin/bijuteri_e38a534b"},
    belts:{w:"https://shop.mango.com/tr/tr/c/kadin/kemer_e38a534b"},
    scarves:{w:"https://shop.mango.com/tr/tr/c/kadin/esarp-ve-fular_e38a534b"},
    sunglasses:{w:"https://shop.mango.com/tr/tr/c/kadin/gunes-gozlugu_e38a534b"},
    accessories:{w:"https://shop.mango.com/tr/tr/c/kadin/canta_e38a534b", m:"https://shop.mango.com/tr/tr/c/erkek/aksesuar_e38a534b"},
    girl:{k:"https://shop.mango.com/tr/tr/c/cocuk/kiz-cocuk_f3b158de"},
    boy:{k:"https://shop.mango.com/tr/tr/c/cocuk/erkek-cocuk_e89704ef"}
  },
  hm: {
    dress:{w:"https://www2.hm.com/tr_tr/kadin/urunler/elbiseler.html"},
    pants:{w:"https://www2.hm.com/tr_tr/kadin/urunler/pantolonlar.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/pantolonlar.html"},
    jeans:{w:"https://www2.hm.com/tr_tr/kadin/urunler/kot-pantolonlar.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/kot-pantolonlar.html"},
    tshirt:{w:"https://www2.hm.com/tr_tr/kadin/urunler/tishortler-ve-atletler.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/tishortler-ve-atletler.html"},
    blouse:{w:"https://www2.hm.com/tr_tr/kadin/urunler/bluzlar-ve-tunikler.html"},
    shirt:{m:"https://www2.hm.com/tr_tr/erkek/urunler/gomlekler.html"},
    jacket:{w:"https://www2.hm.com/tr_tr/kadin/urunler/ceketler-ve-blazerler.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/ceketler-ve-blazerler.html"},
    coat:{w:"https://www2.hm.com/tr_tr/kadin/urunler/montlar-ve-kabanlar.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/montlar-ve-kabanlar.html"},
    skirt:{w:"https://www2.hm.com/tr_tr/kadin/urunler/etekler.html"},
    sweatshirt:{w:"https://www2.hm.com/tr_tr/kadin/urunler/hoodiler-ve-sweatshirtler.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/hoodiler-ve-sweatshirtler.html"},
    suit:{m:"https://www2.hm.com/tr_tr/erkek/urunler/takim-elbiseler.html"},
    underwear:{w:"https://www2.hm.com/tr_tr/kadin/urunler/sutyenler.html", m:"https://www2.hm.com/tr_tr/erkek/urunler/ic-camasirlar.html"},
    swimwear:{w:"https://www2.hm.com/tr_tr/kadin/urunler/mayo-ve-bikiniler.html"},
    shoes:{w:"https://www2.hm.com/tr_tr/kadin/ayakkabi.html", m:"https://www2.hm.com/tr_tr/erkek/ayakkabi.html"},
    bags:{w:"https://www2.hm.com/tr_tr/kadin/canta.html", m:"https://www2.hm.com/tr_tr/erkek/canta.html"},
    accessories:{w:"https://www2.hm.com/tr_tr/kadin/aksesuarlar.html", m:"https://www2.hm.com/tr_tr/erkek/aksesuarlar.html"},
    face:{all:"https://www2.hm.com/tr_tr/guzellik.html"},
    makeup:{all:"https://www2.hm.com/tr_tr/guzellik.html"},
    skincare:{all:"https://www2.hm.com/tr_tr/guzellik.html"},
    girl:{k:"https://www2.hm.com/tr_tr/kiz-cocuk.html"},
    boy:{k:"https://www2.hm.com/tr_tr/erkek-cocuk.html"},
    baby:{k:"https://www2.hm.com/tr_tr/bebek.html"},
    shoes_k:{k:"https://www2.hm.com/tr_tr/cocuk.html"}
  },
  koton: {
    dress:{w:"https://www.koton.com/kadin-elbise"},
    pants:{w:"https://www.koton.com/kadin-pantolon", m:"https://www.koton.com/erkek-pantolon"},
    jeans:{w:"https://www.koton.com/kadin-kot-pantolon", m:"https://www.koton.com/erkek-kot-pantolon"},
    tshirt:{w:"https://www.koton.com/kadin-tisort", m:"https://www.koton.com/erkek-tisort"},
    blouse:{w:"https://www.koton.com/kadin-bluz"},
    shirt:{w:"https://www.koton.com/kadin-gomlek", m:"https://www.koton.com/erkek-gomlek"},
    jacket:{w:"https://www.koton.com/kadin-ceket", m:"https://www.koton.com/erkek-ceket"},
    coat:{w:"https://www.koton.com/kadin-mont-kaban", m:"https://www.koton.com/erkek-mont-kaban"},
    skirt:{w:"https://www.koton.com/kadin-etek"},
    sweatshirt:{w:"https://www.koton.com/kadin-sweatshirt", m:"https://www.koton.com/erkek-sweatshirt"},
    underwear:{w:"https://www.koton.com/kadin-ic-giyim", m:"https://www.koton.com/erkek-ic-giyim"},
    shoes:{w:"https://www.koton.com/kadin-ayakkabi", m:"https://www.koton.com/erkek-ayakkabi"},
    bags:{w:"https://www.koton.com/kadin-canta", m:"https://www.koton.com/erkek-canta"},
    accessories:{w:"https://www.koton.com/kadin-aksesuar", m:"https://www.koton.com/erkek-aksesuar"},
    girl:{k:"https://www.koton.com/kiz-cocuk"},
    boy:{k:"https://www.koton.com/erkek-cocuk"},
    baby:{k:"https://www.koton.com/bebek"}
  },
  lcwaikiki: {
    dress:{w:"https://www.lcwaikiki.com/tr-TR/kadin/elbise"},
    pants:{w:"https://www.lcwaikiki.com/tr-TR/kadin/pantolon", m:"https://www.lcwaikiki.com/tr-TR/erkek/pantolon"},
    jeans:{w:"https://www.lcwaikiki.com/tr-TR/kadin/kot-pantolon", m:"https://www.lcwaikiki.com/tr-TR/erkek/kot-pantolon"},
    tshirt:{w:"https://www.lcwaikiki.com/tr-TR/kadin/tisort", m:"https://www.lcwaikiki.com/tr-TR/erkek/tisort"},
    blouse:{w:"https://www.lcwaikiki.com/tr-TR/kadin/bluz"},
    shirt:{m:"https://www.lcwaikiki.com/tr-TR/erkek/gomlek"},
    jacket:{w:"https://www.lcwaikiki.com/tr-TR/kadin/ceket", m:"https://www.lcwaikiki.com/tr-TR/erkek/ceket"},
    coat:{w:"https://www.lcwaikiki.com/tr-TR/kadin/mont", m:"https://www.lcwaikiki.com/tr-TR/erkek/mont"},
    skirt:{w:"https://www.lcwaikiki.com/tr-TR/kadin/etek"},
    sweatshirt:{w:"https://www.lcwaikiki.com/tr-TR/kadin/sweatshirt", m:"https://www.lcwaikiki.com/tr-TR/erkek/sweatshirt"},
    underwear:{w:"https://www.lcwaikiki.com/tr-TR/kadin/ic-giyim", m:"https://www.lcwaikiki.com/tr-TR/erkek/ic-giyim"},
    shoes:{w:"https://www.lcwaikiki.com/tr-TR/kadin/ayakkabi", m:"https://www.lcwaikiki.com/tr-TR/erkek/ayakkabi"},
    bags:{w:"https://www.lcwaikiki.com/tr-TR/kadin/canta", m:"https://www.lcwaikiki.com/tr-TR/erkek/canta"},
    accessories:{w:"https://www.lcwaikiki.com/tr-TR/kadin/aksesuar", m:"https://www.lcwaikiki.com/tr-TR/erkek/aksesuar"},
    girl:{k:"https://www.lcwaikiki.com/tr-TR/kiz-cocuk"},
    boy:{k:"https://www.lcwaikiki.com/tr-TR/erkek-cocuk"},
    baby:{k:"https://www.lcwaikiki.com/tr-TR/bebek"}
  },
  defacto: {
    dress:{w:"https://www.defacto.com.tr/kadin-elbise"},
    pants:{w:"https://www.defacto.com.tr/kadin-pantolon", m:"https://www.defacto.com.tr/erkek-pantolon"},
    jeans:{w:"https://www.defacto.com.tr/kadin-kot-pantolon", m:"https://www.defacto.com.tr/erkek-kot-pantolon"},
    tshirt:{w:"https://www.defacto.com.tr/kadin-tisort", m:"https://www.defacto.com.tr/erkek-tisort"},
    blouse:{w:"https://www.defacto.com.tr/kadin-bluz"},
    shirt:{m:"https://www.defacto.com.tr/erkek-gomlek"},
    jacket:{w:"https://www.defacto.com.tr/kadin-ceket", m:"https://www.defacto.com.tr/erkek-ceket"},
    coat:{w:"https://www.defacto.com.tr/kadin-mont", m:"https://www.defacto.com.tr/erkek-mont"},
    skirt:{w:"https://www.defacto.com.tr/kadin-etek"},
    sweatshirt:{w:"https://www.defacto.com.tr/kadin-sweatshirt", m:"https://www.defacto.com.tr/erkek-sweatshirt"},
    underwear:{w:"https://www.defacto.com.tr/kadin-ic-giyim", m:"https://www.defacto.com.tr/erkek-ic-giyim"},
    shoes:{w:"https://www.defacto.com.tr/kadin-ayakkabi", m:"https://www.defacto.com.tr/erkek-ayakkabi"},
    bags:{w:"https://www.defacto.com.tr/kadin-canta"},
    girl:{k:"https://www.defacto.com.tr/kiz-cocuk"},
    boy:{k:"https://www.defacto.com.tr/erkek-cocuk"},
    baby:{k:"https://www.defacto.com.tr/bebek"}
  },
  bershka: {
    dress:{w:"https://www.bershka.com/tr/tr/kadin-elbise-l1267.html"},
    pants:{w:"https://www.bershka.com/tr/tr/kadin-pantolon-l1266.html", m:"https://www.bershka.com/tr/tr/erkek-pantolon-l1266.html"},
    jeans:{w:"https://www.bershka.com/tr/tr/kadin-kot-l1266.html", m:"https://www.bershka.com/tr/tr/erkek-kot-l1266.html"},
    tshirt:{w:"https://www.bershka.com/tr/tr/kadin-tisort-l1266.html", m:"https://www.bershka.com/tr/tr/erkek-tisort-l1266.html"},
    sweatshirt:{w:"https://www.bershka.com/tr/tr/kadin-sweatshirt-l1266.html", m:"https://www.bershka.com/tr/tr/erkek-sweatshirt-l1266.html"},
    jacket:{w:"https://www.bershka.com/tr/tr/kadin-ceket-l1266.html", m:"https://www.bershka.com/tr/tr/erkek-ceket-l1266.html"},
    shoes:{w:"https://www.bershka.com/tr/tr/kadin-ayakkabi-l1251.html", m:"https://www.bershka.com/tr/tr/erkek-ayakkabi-l1251.html"},
    accessories:{w:"https://www.bershka.com/tr/tr/kadin-aksesuar-l1060.html", m:"https://www.bershka.com/tr/tr/erkek-aksesuar-l1060.html"}
  },
  pullandbear: {
    dress:{w:"https://www.pullandbear.com/tr/tr/kadin-elbise-l1267.html"},
    pants:{w:"https://www.pullandbear.com/tr/tr/kadin-pantolon-l1266.html", m:"https://www.pullandbear.com/tr/tr/erkek-pantolon-l1266.html"},
    jeans:{w:"https://www.pullandbear.com/tr/tr/kadin-kot-l1266.html", m:"https://www.pullandbear.com/tr/tr/erkek-kot-l1266.html"},
    tshirt:{w:"https://www.pullandbear.com/tr/tr/kadin-tisort-l1266.html", m:"https://www.pullandbear.com/tr/tr/erkek-tisort-l1266.html"},
    sweatshirt:{w:"https://www.pullandbear.com/tr/tr/kadin-sweatshirt-l1266.html", m:"https://www.pullandbear.com/tr/tr/erkek-sweatshirt-l1266.html"},
    jacket:{w:"https://www.pullandbear.com/tr/tr/kadin-ceket-l1266.html", m:"https://www.pullandbear.com/tr/tr/erkek-ceket-l1266.html"},
    shoes:{w:"https://www.pullandbear.com/tr/tr/kadin-ayakkabi-l1251.html", m:"https://www.pullandbear.com/tr/tr/erkek-ayakkabi-l1251.html"},
    accessories:{w:"https://www.pullandbear.com/tr/tr/kadin-aksesuar-l1060.html", m:"https://www.pullandbear.com/tr/tr/erkek-aksesuar-l1060.html"}
  },
  stradivarius: {
    dress:{w:"https://www.stradivarius.com/tr/tr/kadin-elbise-l1267.html"},
    pants:{w:"https://www.stradivarius.com/tr/tr/kadin-pantolon-l1266.html"},
    jeans:{w:"https://www.stradivarius.com/tr/tr/kadin-kot-l1266.html"},
    tshirt:{w:"https://www.stradivarius.com/tr/tr/kadin-tisort-l1266.html"},
    skirt:{w:"https://www.stradivarius.com/tr/tr/kadin-etek-l1266.html"},
    jacket:{w:"https://www.stradivarius.com/tr/tr/kadin-ceket-l1266.html"},
    shoes:{w:"https://www.stradivarius.com/tr/tr/kadin-ayakkabi-l1251.html"},
    accessories:{w:"https://www.stradivarius.com/tr/tr/kadin-aksesuar-l1060.html"}
  },
  massimodutti: {
    dress:{w:"https://www.massimodutti.com/tr/tr/kadin-elbise-l1267.html"},
    pants:{w:"https://www.massimodutti.com/tr/tr/kadin-pantolon-l1266.html", m:"https://www.massimodutti.com/tr/tr/erkek-pantolon-l1266.html"},
    shirt:{m:"https://www.massimodutti.com/tr/tr/erkek-gomlek-l1266.html"},
    jacket:{w:"https://www.massimodutti.com/tr/tr/kadin-ceket-l1266.html", m:"https://www.massimodutti.com/tr/tr/erkek-ceket-l1266.html"},
    suit:{m:"https://www.massimodutti.com/tr/tr/erkek-takim-l1266.html"},
    shoes:{w:"https://www.massimodutti.com/tr/tr/kadin-ayakkabi-l1251.html", m:"https://www.massimodutti.com/tr/tr/erkek-ayakkabi-l1251.html"},
    accessories:{w:"https://www.massimodutti.com/tr/tr/kadin-aksesuar-l1060.html", m:"https://www.massimodutti.com/tr/tr/erkek-aksesuar-l1060.html"}
  },
  guess: {
    pants:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-apparel.html", m:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-apparel.html"},
    bags:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-bags.html", m:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-bags.html"},
    handbags:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-bags.html"},
    shoes:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-shoes.html", m:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-shoes.html"},
    watches:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-watches.html", m:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-watches.html"},
    accessories:{w:"https://www.guess.com/tr-TR/content/guess/tr_TR/women-accessories.html", m:"https://www.guess.com/tr-TR/content/guess/tr_TR/men-accessories.html"}
  },
  tommy: {
    pants:{w:"https://tr.tommy.com/kadin/giyim", m:"https://tr.tommy.com/erkek/giyim"},
    shoes:{w:"https://tr.tommy.com/kadin/ayakkabi", m:"https://tr.tommy.com/erkek/ayakkabi"},
    bags:{w:"https://tr.tommy.com/kadin/canta", m:"https://tr.tommy.com/erkek/canta"},
    accessories:{w:"https://tr.tommy.com/kadin/aksesuar", m:"https://tr.tommy.com/erkek/aksesuar"},
    perfume:{w:"https://tr.tommy.com/kadin/parfum", m:"https://tr.tommy.com/erkek/parfum"}
  },
  calvinklein: {
    pants:{w:"https://www.calvinklein.com/tr-TR/women/clothing", m:"https://www.calvinklein.com/tr-TR/men/clothing"},
    underwear:{w:"https://www.calvinklein.com/tr-TR/women/underwear", m:"https://www.calvinklein.com/tr-TR/men/underwear"},
    bags:{w:"https://www.calvinklein.com/tr-TR/women/handbags", m:"https://www.calvinklein.com/tr-TR/men/bags"},
    handbags:{w:"https://www.calvinklein.com/tr-TR/women/handbags"},
    shoes:{w:"https://www.calvinklein.com/tr-TR/women/shoes", m:"https://www.calvinklein.com/tr-TR/men/shoes"},
    accessories:{w:"https://www.calvinklein.com/tr-TR/women/accessories", m:"https://www.calvinklein.com/tr-TR/men/accessories"},
    perfume:{w:"https://www.calvinklein.com/tr-TR/women/fragrance", m:"https://www.calvinklein.com/tr-TR/men/fragrance"}
  },
  michaelkors: {
    bags:{w:"https://www.michaelkors.global/tr/en/women/handbags/", m:"https://www.michaelkors.global/tr/en/men/bags/"},
    handbags:{w:"https://www.michaelkors.global/tr/en/women/handbags/"},
    shoes:{w:"https://www.michaelkors.global/tr/en/women/shoes/", m:"https://www.michaelkors.global/tr/en/men/shoes/"},
    pants:{w:"https://www.michaelkors.global/tr/en/women/clothing/", m:"https://www.michaelkors.global/tr/en/men/clothing/"},
    watches:{w:"https://www.michaelkors.global/tr/en/women/watches/", m:"https://www.michaelkors.global/tr/en/men/watches/"},
    accessories:{w:"https://www.michaelkors.global/tr/en/women/accessories/", m:"https://www.michaelkors.global/tr/en/men/accessories/"}
  },
  ipekyol: {
    dress:{w:"https://www.ipekyol.com.tr/kadin-elbise"},
    pants:{w:"https://www.ipekyol.com.tr/kadin-pantolon"},
    blouse:{w:"https://www.ipekyol.com.tr/kadin-bluz"},
    jacket:{w:"https://www.ipekyol.com.tr/kadin-ceket"},
    skirt:{w:"https://www.ipekyol.com.tr/kadin-etek"},
    suit:{w:"https://www.ipekyol.com.tr/kadin-takim"},
    shoes:{w:"https://www.ipekyol.com.tr/kadin-ayakkabi"},
    bags:{w:"https://www.ipekyol.com.tr/kadin-canta"},
    accessories:{w:"https://www.ipekyol.com.tr/kadin-aksesuar"}
  },
  vakko: {
    pants:{w:"https://www.vakko.com/kadin/giyim", m:"https://www.vakko.com/erkek/giyim"},
    shoes:{w:"https://www.vakko.com/kadin/ayakkabi", m:"https://www.vakko.com/erkek/ayakkabi"},
    bags:{w:"https://www.vakko.com/kadin/canta"},
    accessories:{w:"https://www.vakko.com/kadin/aksesuar", m:"https://www.vakko.com/erkek/aksesuar"}
  },
  kigili: {
    suit:{m:"https://www.kigili.com/erkek-takim-elbise"},
    shirt:{m:"https://www.kigili.com/erkek-gomlek"},
    pants:{m:"https://www.kigili.com/erkek-pantolon"},
    jacket:{m:"https://www.kigili.com/erkek-ceket"},
    tshirt:{m:"https://www.kigili.com/erkek-tisort"},
    accessories:{m:"https://www.kigili.com/erkek-aksesuar"}
  },
  colins: {
    jeans:{w:"https://www.colins.com.tr/kadin-kot-pantolon", m:"https://www.colins.com.tr/erkek-kot-pantolon", k:"https://www.colins.com.tr/cocuk-kot-pantolon"},
    pants:{w:"https://www.colins.com.tr/kadin-pantolon", m:"https://www.colins.com.tr/erkek-pantolon"},
    tshirt:{w:"https://www.colins.com.tr/kadin-tisort", m:"https://www.colins.com.tr/erkek-tisort"},
    sweatshirt:{w:"https://www.colins.com.tr/kadin-sweatshirt", m:"https://www.colins.com.tr/erkek-sweatshirt"}
  },
  uspoloassn: {
    pants:{w:"https://www.uspoloassn.com.tr/kadin-giyim", m:"https://www.uspoloassn.com.tr/erkek-giyim", k:"https://www.uspoloassn.com.tr/cocuk-giyim"},
    shoes:{w:"https://www.uspoloassn.com.tr/kadin-ayakkabi", m:"https://www.uspoloassn.com.tr/erkek-ayakkabi", k:"https://www.uspoloassn.com.tr/cocuk-ayakkabi"},
    accessories:{w:"https://www.uspoloassn.com.tr/kadin-aksesuar"}
  },
  penti: {
    underwear:{w:"https://www.penti.com/kadin-ic-giyim", m:"https://www.penti.com/erkek-ic-giyim", k:"https://www.penti.com/cocuk-ic-giyim"},
    swimwear:{w:"https://www.penti.com/kadin-mayo-bikini"},
    pajamas:{w:"https://www.penti.com/kadin-pijama"},
    leggings:{w:"https://www.penti.com/kadin-tayt"}
  },
  oysho: {
    underwear:{w:"https://www.oysho.com/tr/tr/kadin-ic-camasir-l1765.html"},
    sport:{w:"https://www.oysho.com/tr/tr/kadin-spor-l1765.html"},
    sport_clothing:{w:"https://www.oysho.com/tr/tr/kadin-spor-l1765.html"},
    swimwear:{w:"https://www.oysho.com/tr/tr/kadin-mayo-l1765.html"},
    pajamas:{w:"https://www.oysho.com/tr/tr/kadin-pijama-l1765.html"},
    accessories:{w:"https://www.oysho.com/tr/tr/kadin-aksesuar-l1060.html"}
  },
  lefties: {
    dress:{w:"https://www.lefties.com/tr/en/woman/clothing/dresses-c1030267514.html", k:"https://www.lefties.com/tr/en/kids/girl/clothing-c1030267605.html"},
    blouse:{w:"https://www.lefties.com/tr/en/woman/clothing/shirts-c1030267513.html"},
    shirt:{m:"https://www.lefties.com/tr/en/man/clothing/shirts-c1030267572.html"},
    tshirt:{w:"https://www.lefties.com/tr/en/woman/clothing/t-shirts-c1030267505.html", m:"https://www.lefties.com/tr/en/man/clothing/t-shirts-c1030267571.html"},
    pants:{w:"https://www.lefties.com/tr/en/woman/clothing/trousers-c1030267528.html", m:"https://www.lefties.com/tr/en/man/clothing/trousers-c1030267575.html"},
    jeans:{w:"https://www.lefties.com/tr/en/woman/clothing/jeans-c1030267527.html", m:"https://www.lefties.com/tr/en/man/clothing/jeans-c1030267574.html"},
    skirt:{w:"https://www.lefties.com/tr/en/woman/clothing/skirts-c1030267516.html"},
    shorts:{w:"https://www.lefties.com/tr/en/woman/clothing/shorts-c1030267517.html", m:"https://www.lefties.com/tr/en/man/clothing/shorts-c1030267576.html"},
    jacket:{w:"https://www.lefties.com/tr/en/woman/clothing/jackets-c1030267532.html", m:"https://www.lefties.com/tr/en/man/clothing/jackets-|-coats-c1030267577.html"},
    suit:{w:"https://www.lefties.com/tr/en/woman/clothing/blazers-c1030267533.html", m:"https://www.lefties.com/tr/en/man/clothing/blazers-c1030267578.html"},
    sweatshirt:{w:"https://www.lefties.com/tr/en/woman/clothing/sweatshirts-c1030267521.html", m:"https://www.lefties.com/tr/en/man/clothing/sweatshirts-c1030267580.html"},
    leggings:{w:"https://www.lefties.com/tr/en/woman/clothing/leggings-c1030267537.html"},
    sport_clothing:{w:"https://www.lefties.com/tr/en/woman/clothing/sportswear-c1030267536.html", m:"https://www.lefties.com/tr/en/man/clothing/sportswear-c1030267585.html"},
    pajamas:{w:"https://www.lefties.com/tr/en/woman/clothing/pyjamas-c1030267541.html", m:"https://www.lefties.com/tr/en/man/clothing/pyjamas-c1030267590.html"},
    underwear:{w:"https://www.lefties.com/tr/en/woman/clothing/underwear-c1030267540.html", m:"https://www.lefties.com/tr/en/man/clothing/underwear-c1030267589.html"},
    swimwear:{w:"https://www.lefties.com/tr/en/woman/clothing/swimwear-c1030267535.html"},
    shoes:{w:"https://www.lefties.com/tr/en/woman/shoes-c1030267545.html", m:"https://www.lefties.com/tr/en/man/shoes-c1030267592.html", k:"https://www.lefties.com/tr/en/kids/girl/footwear/shoes-c1030272335.html"},
    sneakers:{w:"https://www.lefties.com/tr/en/woman/shoes/sneakers-c1030272270.html"},
    bags:{w:"https://www.lefties.com/tr/en/woman/accessories/bags-c1030267557.html"},
    jewelry:{w:"https://www.lefties.com/tr/en/woman/accessories/jewellery-c1030267563.html"},
    girl:{k:"https://www.lefties.com/tr/en/kids/girl/clothing-c1030267605.html"},
    boy:{k:"https://www.lefties.com/tr/en/kids/boy/clothing-c1030267620.html"},
    baby:{k:"https://www.lefties.com/tr/en/kids/baby-girl-c1030267638.html"}
  },
  mavi: {
    jeans:{w:"https://www.mavi.com/kadin-kot-pantolon", m:"https://www.mavi.com/erkek-kot-pantolon"},
    pants:{w:"https://www.mavi.com/kadin-pantolon", m:"https://www.mavi.com/erkek-pantolon"},
    tshirt:{w:"https://www.mavi.com/kadin-tisort", m:"https://www.mavi.com/erkek-tisort"},
    dress:{w:"https://www.mavi.com/kadin-elbise"},
    sweatshirt:{w:"https://www.mavi.com/kadin-sweatshirt", m:"https://www.mavi.com/erkek-sweatshirt"}
  },
  jackjones: {
    jeans:{m:"https://www.jackjones.com/tr-TR/erkek-kot-pantolon"},
    pants:{m:"https://www.jackjones.com/tr-TR/erkek-pantolon"},
    shirt:{m:"https://www.jackjones.com/tr-TR/erkek-gomlek"},
    tshirt:{m:"https://www.jackjones.com/tr-TR/erkek-tisort"},
    jacket:{m:"https://www.jackjones.com/tr-TR/erkek-ceket"},
    sweatshirt:{m:"https://www.jackjones.com/tr-TR/erkek-sweatshirt"}
  },
  avva: {
    shirt:{m:"https://www.avva.com.tr/erkek-gomlek"},
    pants:{m:"https://www.avva.com.tr/erkek-pantolon"},
    suit:{m:"https://www.avva.com.tr/erkek-takim-elbise"},
    jacket:{m:"https://www.avva.com.tr/erkek-ceket"},
    tshirt:{m:"https://www.avva.com.tr/erkek-tisort"}
  },
  levis: {
    jeans:{w:"https://www.levis.com/tr-TR/kadin-kot-pantolon", m:"https://www.levis.com/tr-TR/erkek-kot-pantolon"},
    pants:{w:"https://www.levis.com/tr-TR/kadin-pantolon", m:"https://www.levis.com/tr-TR/erkek-pantolon"},
    tshirt:{w:"https://www.levis.com/tr-TR/kadin-tisort", m:"https://www.levis.com/tr-TR/erkek-tisort"},
    sweatshirt:{w:"https://www.levis.com/tr-TR/kadin-sweatshirt", m:"https://www.levis.com/tr-TR/erkek-sweatshirt"}
  },
  ltb: {
    jeans:{w:"https://www.ltb.com.tr/kadin-kot-pantolon", m:"https://www.ltb.com.tr/erkek-kot-pantolon"},
    pants:{w:"https://www.ltb.com.tr/kadin-pantolon", m:"https://www.ltb.com.tr/erkek-pantolon"},
    tshirt:{w:"https://www.ltb.com.tr/kadin-tisort", m:"https://www.ltb.com.tr/erkek-tisort"}
  },
  trendyolmilla: {
    dress:{w:"https://www.milla.com.tr/elbise"},
    pants:{w:"https://www.milla.com.tr/pantolon"},
    blouse:{w:"https://www.milla.com.tr/bluz"},
    jacket:{w:"https://www.milla.com.tr/ceket"},
    skirt:{w:"https://www.milla.com.tr/etek"},
    shoes:{w:"https://www.milla.com.tr/ayakkabi"},
    accessories:{w:"https://www.milla.com.tr/aksesuar"}
  },
  // SPORTS
  adidas: {
    tshirt:{w:"https://www.adidas.com.tr/kadin-tisort", m:"https://www.adidas.com.tr/erkek-tisort"},
    pants:{w:"https://www.adidas.com.tr/kadin-tayt-ve-pantolon", m:"https://www.adidas.com.tr/erkek-pantolon"},
    jacket:{w:"https://www.adidas.com.tr/kadin-ceket", m:"https://www.adidas.com.tr/erkek-ceket"},
    sweatshirt:{w:"https://www.adidas.com.tr/kadin-hoodie-sweatshirt", m:"https://www.adidas.com.tr/erkek-hoodie-sweatshirt"},
    sport_clothing:{w:"https://www.adidas.com.tr/kadin", m:"https://www.adidas.com.tr/erkek", k:"https://www.adidas.com.tr/cocuk-giyim"},
    bra:{w:"https://www.adidas.com.tr/kadin-spor-sutyeni"},
    shoes:{w:"https://www.adidas.com.tr/kadin-ayakkabi", m:"https://www.adidas.com.tr/erkek-ayakkabi", k:"https://www.adidas.com.tr/cocuk-ayakkabi"},
    sneakers:{w:"https://www.adidas.com.tr/kadin-ayakkabi", m:"https://www.adidas.com.tr/erkek-ayakkabi"},
    sport_shoes:{w:"https://www.adidas.com.tr/kadin-ayakkabi", m:"https://www.adidas.com.tr/erkek-ayakkabi", k:"https://www.adidas.com.tr/cocuk-ayakkabi"},
    bags:{w:"https://www.adidas.com.tr/kadin-canta", m:"https://www.adidas.com.tr/erkek-canta"}
  },
  puma: {
    sport_clothing:{w:"https://tr.puma.com/kadin/giyim", m:"https://tr.puma.com/erkek/giyim", k:"https://tr.puma.com/cocuk/giyim"},
    sport_shoes:{w:"https://tr.puma.com/kadin/ayakkabi", m:"https://tr.puma.com/erkek/ayakkabi", k:"https://tr.puma.com/cocuk/ayakkabi"},
    sneakers:{w:"https://tr.puma.com/kadin/ayakkabi", m:"https://tr.puma.com/erkek/ayakkabi"},
    accessories:{w:"https://tr.puma.com/kadin/aksesuar", m:"https://tr.puma.com/erkek/aksesuar"}
  },
  reebok: {
    sport_clothing:{w:"https://www.reebok.com.tr/kadin-giyim", m:"https://www.reebok.com.tr/erkek-giyim"},
    sport_shoes:{w:"https://www.reebok.com.tr/kadin-ayakkabi", m:"https://www.reebok.com.tr/erkek-ayakkabi"},
    sneakers:{w:"https://www.reebok.com.tr/kadin-ayakkabi", m:"https://www.reebok.com.tr/erkek-ayakkabi"}
  },
  newbalance: {
    sport_shoes:{w:"https://www.newbalance.com.tr/kadin/ayakkabi", m:"https://www.newbalance.com.tr/erkek/ayakkabi", k:"https://www.newbalance.com.tr/cocuk/ayakkabi"},
    sneakers:{w:"https://www.newbalance.com.tr/kadin/ayakkabi", m:"https://www.newbalance.com.tr/erkek/ayakkabi"},
    sport_clothing:{w:"https://www.newbalance.com.tr/kadin/giyim", m:"https://www.newbalance.com.tr/erkek/giyim"}
  },
  decathlon: {
    sport_clothing:{w:"https://www.decathlon.com.tr/kadin-spor-giyim", m:"https://www.decathlon.com.tr/erkek-spor-giyim", k:"https://www.decathlon.com.tr/cocuk-spor-giyim"},
    sport_shoes:{w:"https://www.decathlon.com.tr/kadin-spor-ayakkabi", m:"https://www.decathlon.com.tr/erkek-spor-ayakkabi", k:"https://www.decathlon.com.tr/cocuk-spor-ayakkabi"},
    equipment:{all:"https://www.decathlon.com.tr/spor-malzemeleri"}
  },
  underarmour: {
    sport_clothing:{w:"https://www.underarmour.com/tr-TR/womens-clothing", m:"https://www.underarmour.com/tr-TR/mens-clothing"},
    sport_shoes:{w:"https://www.underarmour.com/tr-TR/womens-shoes", m:"https://www.underarmour.com/tr-TR/mens-shoes"}
  },
  hummel: {
    sport_clothing:{w:"https://www.hummel.net/tr-TR/kadin-giyim", m:"https://www.hummel.net/tr-TR/erkek-giyim", k:"https://www.hummel.net/tr-TR/cocuk-giyim"},
    sport_shoes:{w:"https://www.hummel.net/tr-TR/kadin-ayakkabi", m:"https://www.hummel.net/tr-TR/erkek-ayakkabi", k:"https://www.hummel.net/tr-TR/cocuk-ayakkabi"}
  },
  thenorthface: {
    sport_clothing:{w:"https://www.thenorthface.com/tr-TR/kadin-giyim", m:"https://www.thenorthface.com/tr-TR/erkek-giyim"},
    jacket:{w:"https://www.thenorthface.com/tr-TR/kadin-giyim", m:"https://www.thenorthface.com/tr-TR/erkek-giyim"},
    sport_shoes:{w:"https://www.thenorthface.com/tr-TR/kadin-ayakkabi", m:"https://www.thenorthface.com/tr-TR/erkek-ayakkabi"},
    bags:{w:"https://www.thenorthface.com/tr-TR/kadin-canta", m:"https://www.thenorthface.com/tr-TR/erkek-canta"},
    backpack:{w:"https://www.thenorthface.com/tr-TR/kadin-canta", m:"https://www.thenorthface.com/tr-TR/erkek-canta"}
  },
  converse: {
    sneakers:{w:"https://www.converse.com.tr/kadin-ayakkabi", m:"https://www.converse.com.tr/erkek-ayakkabi", k:"https://www.converse.com.tr/cocuk-ayakkabi"},
    sport_shoes:{w:"https://www.converse.com.tr/kadin-ayakkabi", m:"https://www.converse.com.tr/erkek-ayakkabi"},
    sport_clothing:{w:"https://www.converse.com.tr/kadin-giyim", m:"https://www.converse.com.tr/erkek-giyim"}
  },
  vans: {
    sneakers:{w:"https://www.vans.com.tr/kadin/ayakkabi", m:"https://www.vans.com.tr/erkek/ayakkabi"},
    sport_shoes:{w:"https://www.vans.com.tr/kadin/ayakkabi", m:"https://www.vans.com.tr/erkek/ayakkabi"},
    sport_clothing:{w:"https://www.vans.com.tr/kadin/giyim", m:"https://www.vans.com.tr/erkek/giyim"}
  },
  skechers: {
    sneakers:{w:"https://www.skechers.com.tr/kadin-ayakkabi", m:"https://www.skechers.com.tr/erkek-ayakkabi", k:"https://www.skechers.com.tr/cocuk-ayakkabi"},
    sport_shoes:{w:"https://www.skechers.com.tr/kadin-ayakkabi", m:"https://www.skechers.com.tr/erkek-ayakkabi"}
  },
  // SHOES
  flo: {
    shoes:{w:"https://www.flo.com.tr/kadin-ayakkabi", m:"https://www.flo.com.tr/erkek-ayakkabi", k:"https://www.flo.com.tr/cocuk-ayakkabi"},
    sneakers:{w:"https://www.flo.com.tr/spor-ayakkabi", m:"https://www.flo.com.tr/spor-ayakkabi"},
    sport_shoes:{all:"https://www.flo.com.tr/spor-ayakkabi"}
  },
  aldo: {
    shoes:{w:"https://www.aldoshoes.com/tr-TR/women/shoes", m:"https://www.aldoshoes.com/tr-TR/men/shoes"},
    handbags:{w:"https://www.aldoshoes.com/tr-TR/women/handbags"},
    bags:{w:"https://www.aldoshoes.com/tr-TR/women/handbags"},
    accessories:{w:"https://www.aldoshoes.com/tr-TR/women/accessories"}
  },
  derimod: {
    shoes:{w:"https://www.derimod.com.tr/kadin-ayakkabi", m:"https://www.derimod.com.tr/erkek-ayakkabi"},
    bags:{w:"https://www.derimod.com.tr/kadin-canta", m:"https://www.derimod.com.tr/erkek-canta"},
    handbags:{w:"https://www.derimod.com.tr/kadin-canta"},
    belts:{w:"https://www.derimod.com.tr/kadin-kemer", m:"https://www.derimod.com.tr/erkek-kemer"},
    wallets:{w:"https://www.derimod.com.tr/kadin-cuzdan", m:"https://www.derimod.com.tr/erkek-cuzdan"}
  },
  elle: {
    shoes:{w:"https://www.elle.com.tr/kadin-ayakkabi"},
    bags:{w:"https://www.elle.com.tr/kadin-canta"},
    handbags:{w:"https://www.elle.com.tr/kadin-canta"},
    accessories:{w:"https://www.elle.com.tr/kadin-aksesuar"}
  },
  // BEAUTY
  gratis: {
    face:{all:"https://www.gratis.com/makyaj/yuz-makyaji"},
    eye:{all:"https://www.gratis.com/makyaj/goz-makyaji"},
    lips:{all:"https://www.gratis.com/makyaj/dudak-urunleri"},
    nails:{all:"https://www.gratis.com/makyaj/oje-ve-tirnak-bakimi"},
    makeup:{all:"https://www.gratis.com/makyaj"},
    skincare:{all:"https://www.gratis.com/cilt-bakimi"},
    haircare:{all:"https://www.gratis.com/sac-bakimi"},
    bodycare:{all:"https://www.gratis.com/vucut-bakimi"},
    perfume:{w:"https://www.gratis.com/parfum/kadin-parfumu", m:"https://www.gratis.com/parfum/erkek-parfumu"},
    men:{all:"https://www.gratis.com/erkek-bakim"}
  },
  rossmann: {
    makeup:{all:"https://www.rossmann.com.tr/makyaj"},
    skincare:{all:"https://www.rossmann.com.tr/cilt-bakimi"},
    haircare:{all:"https://www.rossmann.com.tr/sac-bakimi"},
    bodycare:{all:"https://www.rossmann.com.tr/kisisel-bakim"},
    perfume:{all:"https://www.rossmann.com.tr/parfum"}
  },
  watsons: {
    makeup:{all:"https://www.watsons.com.tr/makyaj"},
    skincare:{all:"https://www.watsons.com.tr/cilt-bakimi"},
    haircare:{all:"https://www.watsons.com.tr/sac-bakimi"},
    bodycare:{all:"https://www.watsons.com.tr/kisisel-bakim"},
    perfume:{all:"https://www.watsons.com.tr/parfum"}
  },
  sephora: {
    face:{all:"https://www.sephora.com.tr/yuz-makyaj"},
    eye:{all:"https://www.sephora.com.tr/goz-makyaj"},
    lips:{all:"https://www.sephora.com.tr/dudak-urunleri"},
    makeup:{all:"https://www.sephora.com.tr/yuz-makyaj"},
    skincare:{all:"https://www.sephora.com.tr/cilt-bakimi"},
    haircare:{all:"https://www.sephora.com.tr/sac-bakimi"},
    perfume:{all:"https://www.sephora.com.tr/parfum"},
    men:{all:"https://www.sephora.com.tr/erkek-bakim"}
  },
  flormar: {
    face:{all:"https://www.flormar.com/yuz"},
    eye:{all:"https://www.flormar.com/goz"},
    lips:{all:"https://www.flormar.com/dudak"},
    nails:{all:"https://www.flormar.com/tirnak"},
    skincare:{all:"https://www.flormar.com/cilt-bakimi"},
    makeup:{all:"https://www.flormar.com/yuz"}
  },
  goldenrose: {
    face:{all:"https://www.goldenrose.com.tr/yuz-makyaji"},
    eye:{all:"https://www.goldenrose.com.tr/goz-makyaji"},
    lips:{all:"https://www.goldenrose.com.tr/dudak-urunleri"},
    nails:{all:"https://www.goldenrose.com.tr/oje"},
    skincare:{all:"https://www.goldenrose.com.tr/cilt-bakimi"},
    makeup:{all:"https://www.goldenrose.com.tr/yuz-makyaji"}
  },
  mac: {
    face:{all:"https://www.maccosmetics.com/tr-TR/collections/face"},
    eye:{all:"https://www.maccosmetics.com/tr-TR/collections/eyes"},
    lips:{all:"https://www.maccosmetics.com/tr-TR/collections/lips"},
    skincare:{all:"https://www.maccosmetics.com/tr-TR/collections/skincare"},
    makeup:{all:"https://www.maccosmetics.com/tr-TR/collections/face"}
  },
  kiko: {
    face:{all:"https://www.kikocosmetics.com/tr-TR/c/face"},
    eye:{all:"https://www.kikocosmetics.com/tr-TR/c/eyes"},
    lips:{all:"https://www.kikocosmetics.com/tr-TR/c/lips"},
    nails:{all:"https://www.kikocosmetics.com/tr-TR/c/nails"},
    skincare:{all:"https://www.kikocosmetics.com/tr-TR/c/skincare"},
    makeup:{all:"https://www.kikocosmetics.com/tr-TR/c/face"}
  },
  eveshop: {
    makeup:{all:"https://www.eveshop.com.tr/makyaj"},
    skincare:{all:"https://www.eveshop.com.tr/cilt-bakimi"},
    perfume:{all:"https://www.eveshop.com.tr/parfum"}
  },
  loreal: {
    makeup:{all:"https://www.loreal-paris.com.tr/makyaj"},
    skincare:{all:"https://www.loreal-paris.com.tr/cilt-bakimi"},
    haircare:{all:"https://www.loreal-paris.com.tr/sac-bakimi"},
    face:{all:"https://www.loreal-paris.com.tr/makyaj"}
  },
  clinique: {
    skincare:{all:"https://www.clinique.com/tr/skincare"},
    makeup:{all:"https://www.clinique.com/tr/makeup"},
    face:{all:"https://www.clinique.com/tr/makeup"},
    perfume:{all:"https://www.clinique.com/tr/fragrance"},
    men:{all:"https://www.clinique.com/tr/mens"}
  },
  esteelauder: {
    skincare:{all:"https://www.esteelauder.com/tr-TR/skincare"},
    makeup:{all:"https://www.esteelauder.com/tr-TR/makeup"},
    face:{all:"https://www.esteelauder.com/tr-TR/makeup"},
    perfume:{all:"https://www.esteelauder.com/tr-TR/fragrance"}
  },
  lancome: {
    skincare:{all:"https://www.lancome.com/tr-TR/skincare"},
    makeup:{all:"https://www.lancome.com/tr-TR/makeup"},
    face:{all:"https://www.lancome.com/tr-TR/makeup"},
    perfume:{all:"https://www.lancome.com/tr-TR/fragrance"}
  },
  // HOME
  karaca: {
    kitchen:{all:"https://www.karaca.com/mutfak"},
    dining:{all:"https://www.karaca.com/sofra"},
    bedding:{all:"https://www.karaca.com/yatak-odasi"},
    bathroom:{all:"https://www.karaca.com/banyo"},
    decor:{all:"https://www.karaca.com/dekor"},
    cookware:{all:"https://www.karaca.com/tencere-tava"},
    electrical:{all:"https://www.karaca.com/mutfak"}
  },
  korkmaz: {
    cookware:{all:"https://www.korkmaz.com.tr/tencere-tava"},
    electrical:{all:"https://www.korkmaz.com.tr/elektrikli-urunler"},
    kitchen:{all:"https://www.korkmaz.com.tr/mutfak-urunleri"}
  },
  tefal: {
    cookware:{all:"https://www.tefal.com/tr-TR/cooking/pans"},
    kitchen:{all:"https://www.tefal.com/tr-TR/cooking/pans"},
    electrical:{all:"https://www.tefal.com/tr-TR/kitchen-electrics/kettles"}
  },
  englishhome: {
    bedding:{all:"https://www.englishhome.com/nevresim-takimi"},
    curtains:{all:"https://www.englishhome.com/perde"},
    towels:{all:"https://www.englishhome.com/havlu"},
    bathroom:{all:"https://www.englishhome.com/banyo"},
    kitchen:{all:"https://www.englishhome.com/mutfak"},
    decor:{all:"https://www.englishhome.com/dekorasyon"},
    rugs:{all:"https://www.englishhome.com/hali"}
  },
  madamecoco: {
    bedding:{all:"https://www.madamecoco.com.tr/nevresim-takimi"},
    towels:{all:"https://www.madamecoco.com.tr/havlu"},
    decor:{all:"https://www.madamecoco.com.tr/dekorasyon"},
    kitchen:{all:"https://www.madamecoco.com.tr/mutfak"},
    curtains:{all:"https://www.madamecoco.com.tr/perde"}
  },
  bellamaison: {
    bedding:{all:"https://www.bellamaison.com.tr/nevresim-takimi"},
    curtains:{all:"https://www.bellamaison.com.tr/perde"},
    towels:{all:"https://www.bellamaison.com.tr/havlu"},
    decor:{all:"https://www.bellamaison.com.tr/dekorasyon"},
    rugs:{all:"https://www.bellamaison.com.tr/hali"}
  },
  yatas: {
    mattress:{all:"https://www.yatas.com.tr/yatak-ve-baza"},
    bedding:{all:"https://www.yatas.com.tr/nevresim"},
    furniture:{all:"https://www.yatas.com.tr/koltuk"}
  },
  ozdilek: {
    mattress:{all:"https://www.ozdilek.com.tr/yatak"},
    bedding:{all:"https://www.ozdilek.com.tr/nevresim"},
    furniture:{all:"https://www.ozdilek.com.tr/mobilya"},
    decor:{all:"https://www.ozdilek.com.tr/dekorasyon"},
    curtains:{all:"https://www.ozdilek.com.tr/perde"}
  },
  // KIDS
  chicco: {
    strollers:{all:"https://www.chicco.com.tr/cocuk-arabasi"},
    care:{all:"https://www.chicco.com.tr/oto-koltugu"},
    baby:{all:"https://www.chicco.com.tr/bebek-giyim"},
    feeding:{all:"https://www.chicco.com.tr/besleme"},
    toys:{all:"https://www.chicco.com.tr/oyuncak"}
  },
  ebebek: {
    girl:{all:"https://www.ebebek.com/kiz-cocuk-giyim"},
    boy:{all:"https://www.ebebek.com/erkek-cocuk-giyim"},
    baby:{all:"https://www.ebebek.com/bebek-giyim"},
    shoes:{all:"https://www.ebebek.com/cocuk-ayakkabi"},
    toys:{all:"https://www.ebebek.com/oyuncak"},
    strollers:{all:"https://www.ebebek.com/bebek-arabasi"},
    feeding:{all:"https://www.ebebek.com/besleme"},
    care:{all:"https://www.ebebek.com/bebek-bakimi"}
  }
};

// Brand display names
export const BRAND_NAMES = {
  zara:"Zara TR", mango:"Mango TR", hm:"H&M TR", koton:"Koton",
  lcwaikiki:"LC Waikiki", defacto:"DeFacto", bershka:"Bershka TR",
  pullandbear:"Pull&Bear TR", stradivarius:"Stradivarius TR",
  massimodutti:"Massimo Dutti TR", guess:"Guess TR", tommy:"Tommy Hilfiger TR",
  calvinklein:"Calvin Klein TR", michaelkors:"Michael Kors TR",
  ipekyol:"İpekyol", vakko:"Vakko", kigili:"Kiğılı", colins:"Colin's",
  uspoloassn:"US Polo Assn", penti:"Penti", oysho:"Oysho TR",
  lefties:"Lefties TR", mavi:"Mavi", jackjones:"Jack & Jones TR",
  avva:"Avva", levis:"Levi's TR", ltb:"LTB", trendyolmilla:"Trendyol Milla",
  adidas:"Adidas TR", puma:"Puma TR", reebok:"Reebok TR",
  newbalance:"New Balance TR", decathlon:"Decathlon TR",
  underarmour:"Under Armour TR", hummel:"Hummel TR",
  thenorthface:"The North Face TR", converse:"Converse TR",
  vans:"Vans TR", skechers:"Skechers TR",
  flo:"Flo", aldo:"Aldo TR", derimod:"Derimod", elle:"Elle TR",
  gratis:"Gratis", rossmann:"Rossmann TR", watsons:"Watsons TR",
  sephora:"Sephora TR", flormar:"Flormar", goldenrose:"Golden Rose",
  mac:"MAC TR", kiko:"Kiko Milano TR", eveshop:"eveShop TR",
  loreal:"L'Oréal TR", clinique:"Clinique TR", esteelauder:"Estée Lauder TR",
  lancome:"Lancôme TR",
  karaca:"Karaca", korkmaz:"Korkmaz", tefal:"Tefal TR",
  englishhome:"English Home", madamecoco:"Madame Coco",
  bellamaison:"Bellamaison", yatas:"Yataş", ozdilek:"Özdilek",
  chicco:"Chicco TR", ebebek:"Ebebek"
};

// Domain map
export const BRAND_DOMAINS = {
  zara:"zara.com", mango:"mango.com", hm:"hm.com", koton:"koton.com",
  lcwaikiki:"lcwaikiki.com", defacto:"defacto.com.tr", bershka:"bershka.com",
  pullandbear:"pullandbear.com", stradivarius:"stradivarius.com",
  massimodutti:"massimodutti.com", guess:"guess.com", tommy:"tommy.com",
  calvinklein:"calvinklein.com", michaelkors:"michaelkors.global",
  ipekyol:"ipekyol.com.tr", vakko:"vakko.com", kigili:"kigili.com",
  colins:"colins.com.tr", uspoloassn:"uspoloassn.com.tr", penti:"penti.com",
  oysho:"oysho.com", lefties:"lefties.com", mavi:"mavi.com",
  jackjones:"jackjones.com", avva:"avva.com.tr", levis:"levis.com",
  ltb:"ltb.com.tr", trendyolmilla:"milla.com.tr",
  adidas:"adidas.com.tr", puma:"puma.com", reebok:"reebok.com",
  newbalance:"newbalance.com.tr", decathlon:"decathlon.com.tr",
  underarmour:"underarmour.com", hummel:"hummel.net",
  thenorthface:"thenorthface.com", converse:"converse.com",
  vans:"vans.com", skechers:"skechers.com.tr",
  flo:"flo.com.tr", aldo:"aldoshoes.com", derimod:"derimod.com.tr",
  elle:"elle.com.tr",
  gratis:"gratis.com", rossmann:"rossmann.com.tr", watsons:"watsons.com.tr",
  sephora:"sephora.com.tr", flormar:"flormar.com", goldenrose:"goldenrose.com.tr",
  mac:"maccosmetics.com", kiko:"kikocosmetics.com", eveshop:"eveshop.com.tr",
  loreal:"loreal-paris.com.tr", clinique:"clinique.com",
  esteelauder:"esteelauder.com", lancome:"lancome.com",
  karaca:"karaca.com", korkmaz:"korkmaz.com.tr", tefal:"tefal.com",
  englishhome:"englishhome.com", madamecoco:"madamecoco.com.tr",
  bellamaison:"bellamaison.com.tr", yatas:"yatas.com.tr", ozdilek:"ozdilek.com.tr",
  chicco:"chicco.com.tr", ebebek:"ebebek.com"
};
