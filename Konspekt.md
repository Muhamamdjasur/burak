# 📘 TypeScript va Patternlar

**1 ta dars = 5 ta reja.** Qaytganingda shu faylni och, bir qarashda hammasi esingga tushadi.

## ⚡ Bir qarashda

| # | Reja | Bir gapda |
|---|---|---|
| 1 | Compiled va Interpreted | Tarjimon kodni **oldindan** yoki **yo'l-yo'lakay** tarjima qiladi |
| 2 | TypeScript nima? | JavaScript + **qo'riqchi**: xatoni oldindan tutadi |
| 3 | Dynamic va Interface | Dynamic = turi erkin. Interface = obyektning **anketasi** |
| 4 | Burak backend | TypeScript bilan server quramiz |
| 5 | Patternlar | Dasturchilarning **tayyor retseptlari** |

---

## 1️⃣ Compiled va Interpreted

Kompyuter faqat `0` va `1` ni tushunadi, shuning uchun **tarjimon** kerak.

- **Compiled** = butun kitob **oldindan** tarjima qilinadi.
  Tez ishlaydi, xato **oldin** topiladi. *(C++, Go, Rust)*
- **Interpreted** = tarjimon yoningda **gapma-gap** tarjima qiladi.
  Darrov boshlanadi, xato **kech** chiqadi. *(Python, JavaScript)*

```js
console.log("Salom");
console.log(yoq.length); // xato!
```

- Interpreted: `Salom` chiqadi, keyin dastur yiqiladi
- Compiled: hech narsa chiqmaydi, xato oldindan topiladi

---

## 2️⃣ TypeScript nima?

> **TypeScript = JavaScript + qo'riqchi**

- JavaScript xatoni **kech** aytadi. Dastur kattalashsa, bu og'ir.
- TypeScript kodni ishga tushishdan **oldin** tekshiradi, keyin oddiy JavaScript'ga aylantiradi (brauzer va Node.js faqat JavaScript biladi).
- 2012-yilda Microsoft yaratgan.

```ts
function qosh(a: number, b: number) {
  return a + b;
}
qosh(5, "3"); // ❌ "3" raqam emas!
```

JavaScript'da `5 + "3"` jimgina `"53"` bo'lib qoladi. TypeScript esa darrov to'xtatadi.
Yana bir foyda: VS Code yozayotganingda maslahat beradi.

---

## 3️⃣ Dynamic va Interface

**JavaScript = dynamic** (turi erkin), **TypeScript = turi oldindan aniq**:

```js
let x = 5;
x = "salom";          // JavaScript: mayli
```

```ts
let x: number = 5;
x = "salom";          // ❌ TypeScript: x raqam bo'lishi kerak
```

> ⚠️ `any` degan tur qo'riqchini uxlatib qo'yadi. Iloji boricha ishlatma.

**Interface = anketa.** Obyekt qanday bo'lishi kerakligini oldindan aytadi:

```ts
interface Odam {
  ism: string;
  yosh: number;
}

const a: Odam = { ism: "Ali", yosh: 10 };  // ✅
const b: Odam = { ism: "Vali" };           // ❌ yosh yo'q
```

---

## 4️⃣ Burak backend (TypeScript bilan)

**O'rnatish:**

```bash
npm init -y
npm i express
npm i -D typescript ts-node @types/node @types/express
```

**Papka tuzilmasi** (`tsconfig.json` ildizda, `package.json` yonida!):

```
BURAK/
├─ package.json
├─ tsconfig.json
└─ src/
   └─ server.ts
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**package.json ichida:**

```json
"scripts": {
  "start": "ts-node src/server.ts"
}
```

**src/server.ts:**

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Salom, Burak!");
});

app.listen(3000, () => console.log("Server 3000-portda"));
```

**Ishga tushirish:** `npm run start`

**🐞 Xatolar daftari**

| Xato | Sababi | Yechim |
|---|---|---|
| `Unexpected token 'export'` | `tsconfig.json` topilmadi yoki `module` noto'g'ri | Faylni ildizga qo'y, `"module": "commonjs"` yoz |
| `tsc` yordam matnini chiqaradi | `tsconfig.json` topilmadi | `ls` bilan tekshir, nomi aynan `tsconfig.json` bo'lsin |

---

## 5️⃣ Patternlar

> **Pattern = tayyor retsept.** Dasturchilar ko'p uchragan muammoga sinalgan yechim topgan, biz uni qayta ishlatamiz.

Ikki xil bo'ladi:

**🏠 Architecture pattern = uyning umumiy rejasi** (katta rasm, butun loyiha)

**MVC** — restoran misoli:

| Harf | Nomi | Restoranda |
|---|---|---|
| **M** | Model | Oshxona ombori (ma'lumotlar) |
| **V** | View | Menyu va dasturxon (foydalanuvchi ko'radigani) |
| **C** | Controller | Ofitsiant (so'rovni olib, ishni taqsimlaydi) |

**🪑 Design pattern = mebel ustasining yechimlari** (kichik, kod darajasida)

- **Singleton** = faqat **bitta** nusxa (masalan, bitta ma'lumotlar bazasi ulanishi)
- **Factory** = **zavod**: buyurtmaga qarab kerakli obyektni yasab beradi
- **Observer** = **obuna**: yangilik chiqsa, hamma obunachiga xabar boradi

Klassik design patternlar jami 23 ta (Gang of Four kitobidan). Ularni birma-bir o'rganamiz.

---



