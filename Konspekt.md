

# | 54 | Member -- Scheme Model 📘 Service qatlami va Mongoose (Schema, Model, Query)

## ⚡ Bir qarashda

| # | Mavzu | Bir gapda |
|---|---|---|
| 1 | Member Service | Controller bilan Model orasidagi **miyaga** o'xshagan qatlam |
| 2 | Schema / Model / Query | Anketa / Anketa asosidagi vosita / o'sha vosita bilan berilgan **buyruq** |
| 3 | Member Schema | Member uchun anketani yozib chiqamiz |

---

## 1️⃣ Member Service nima?

### Eslatma: hozirgi oqim

O'tgan darsda shu qolipni qurgan edik:

```
Router → Controller → Model → baza
```

Bu kichik loyiha uchun yetarli. Lekin Controller ichida **ko'p mantiq** (masalan: "yosh 18 dan katta bo'lsin", "email band bo'lmasin", "parolni shifrlash kerak") to'planib qolsa, Controller ham **shishib ketadi** — xuddi bitta xonaga hammasini joylashtirgan Router muammosi kabi!

### Yechim: Service qatlami

**Restoran misolida:**

| Kim | Vazifasi |
|---|---|
| Qorovul (Router) | Kelgan odamni to'g'ri bo'limga yo'naltiradi |
| Ofitsiant (Controller) | Buyurtmani oladi, mijoz bilan gaplashadi |
| **Oshpaz (Service)** | Taomni **haqiqatda tayyorlaydi** — retsept, texnika shu yerda |
| Ombor (Model) | Kerakli mahsulotni beradi/saqlaydi |

Ofitsiant (Controller) o'zi **ovqat pishirmaydi** — u faqat buyurtmani oshpazga (Service) yetkazadi, oshpaz esa **qanday pishirishni** biladi.

### Yangi oqim

```
Router → Controller → Service → Model → baza
```

- **Controller** — faqat so'rovni qabul qiladi va javob qaytaradi (yupqa qatlam)
- **Service** — **asosiy mantiq** shu yerda: tekshirish, hisoblash, qoidalar
- **Model** — bazaga ma'lumot yozish/o'qish

### Kod bilan

**`src/services/MemberService.ts`:**

```ts
import Member from "../models/Member";

class MemberService {
  // Yangi a'zo yaratish
  public async createMember(data: { ism: string; email: string }) {
    // Mana shu yerda "mantiq" bo'ladi, masalan tekshiruv:
    if (!data.email.includes("@")) {
      throw new Error("Email noto'g'ri formatda");
    }

    const yangiMember = new Member(data);
    return await yangiMember.save();
  }

  // Hamma a'zolarni olish
  public async getMembers() {
    return await Member.find();
  }
}

export default new MemberService();
```

**`src/controllers/memberController.ts`** (endi yupqa bo'ladi):

```ts
import { Request, Response } from "express";
import MemberService from "../services/MemberService";

export const createMember = async (req: Request, res: Response) => {
  try {
    const yangiMember = await MemberService.createMember(req.body);
    res.send(yangiMember);
  } catch (xato: any) {
    res.status(400).send({ xabar: xato.message });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  const hammasi = await MemberService.getMembers();
  res.send(hammasi);
};
```

> 🔍 **Nega bu foydali?** Agar ertaga mobil ilova ham shu mantiqni ishlatmoqchi bo'lsa, Controller'ni yozmasdan, to'g'ridan-to'g'ri **Service**ni chaqirsa bo'ladi. Mantiq **bir joyda**, takrorlanmaydi.

---

## 2️⃣ Mongoose'da Schema, Model, Query

Bu uchtasi ko'p chalkashtiriladi, shuning uchun **kutubxona** misolida tushuntiramiz.

| Atama | Kutubxonada | Vazifasi |
|---|---|---|
| **Schema** | Kitob katalogining **qoidasi** ("har bir kitobda: nomi, muallifi, yili bo'lishi shart") | Ma'lumot qanday ko'rinishda bo'lishini belgilaydi |
| **Model** | Kutubxonachi | Qoidaga asoslanib, kitob **qo'shadi, qidiradi, o'chiradi** |
| **Query** | Kutubxonachiga bergan **so'rov** ("menga 2020-yilgi kitoblarni toping") | Ma'lum shartlar bilan ma'lumot so'rash |

### Schema — qoida

```ts
const memberSchema = new mongoose.Schema({
  ism: { type: String, required: true },
  yosh: { type: Number },
});
```

### Model — qoida asosidagi vosita

```ts
const Member = mongoose.model("Member", memberSchema);
```

Bu bilan endi `Member` degan **vosita** paydo bo'ldi, u orqali bazaga murojaat qilamiz.

### Query — vosita orqali buyruq berish

```ts
// Hammasini olish
await Member.find();

// Shart bilan olish: yoshi 18 dan katta bo'lganlar
await Member.find({ yosh: { $gt: 18 } });

// Bittasini olish
await Member.findOne({ ism: "Ali" });

// ID orqali olish
await Member.findById("123");

// Yangilash
await Member.findByIdAndUpdate("123", { yosh: 20 });

// O'chirish
await Member.findByIdAndDelete("123");
```

> 💡 **`$gt`** — "greater than" (kattaroq) degani. Mongoose'da shunga o'xshash belgilar bor: `$lt` (kichikroq), `$eq` (teng), `$in` (ro'yxatda bor).

**Xulosa formulasi:**

```
Schema (qoida) → Model (qoida asosidagi vosita) → Query (vosita bilan buyruq)
```

---

## 3️⃣ Member uchun to'liq Schema yasaymiz

Endi hammasini birlashtirib, **haqiqiy** Member schema'sini yozamiz — oddiy emas, amaliyotda ishlatiladigan darajada.

**`src/models/Member.ts`:**

```ts
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    ism: {
      type: String,
      required: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ikkita bir xil email bo'lolmaydi
    },
    parol: {
      type: String,
      required: true,
    },
    yosh: {
      type: Number,
      default: 0, // agar berilmasa, 0 bo'ladi
    },
    holat: {
      type: String,
      enum: ["FAOL", "BLOKLANGAN"], // faqat shu ikkitasidan biri bo'lishi mumkin
      default: "FAOL",
    },
  },
  {
    timestamps: true, // createdAt va updatedAt avtomatik qo'shiladi
  }
);

const Member = mongoose.model("Member", memberSchema);
export default Member;
```

### Yangi qoidalarni tushuntirib o'tamiz

| Qoida | Ma'nosi |
|---|---|
| `minlength: 2` | Ism kamida 2 harfdan iborat bo'lishi kerak |
| `unique: true` | Bu maydon **takrorlanmasligi** kerak (email band bo'lsa, xato beradi) |
| `default: 0` | Qiymat berilmasa, shu qiymat o'zi qo'yiladi |
| `enum: [...]` | Faqat ro'yxatdagi qiymatlardan **biri** bo'lishi mumkin |
| `timestamps: true` | Mongoose o'zi `createdAt` (yaratilgan vaqt) va `updatedAt` (yangilangan vaqt) qo'shadi |

> 📋 Bu — xuddi maktabga hujjat topshirishga o'xshaydi: ba'zi maydonlar **majburiy** (`required`), ba'zilari **o'z-o'zidan to'ldiriladi** (`default`), ba'zilari esa **faqat ro'yxatdan tanlanadi** (`enum`).

---

## 🧩 Hammasi birga

```
src/
├─ models/
│   └─ Member.ts          ← Schema + Model
├─ services/
│   └─ MemberService.ts    ← Asosiy mantiq
├─ controllers/
│   └─ memberController.ts ← Yupqa, faqat so'rov/javob
└─ routers/
    └─ memberRouter.ts
```

```
Router → Controller → Service → Model (Schema orqali) → Query → baza
```

---

## 📝 O'zimni tekshiraman

1. Service qatlami nima uchun kerak, Controller o'zi mantiqni bajarsa bo'lmaydimi?
2. Schema, Model va Query orasidagi farqni o'z so'zing bilan tushuntir
3. `unique: true` va `default` orasidagi farq nima?
4. `enum` nima uchun ishlatiladi, misol kelt



# | 53 | Router and Controller 📘 Router, MVC va Controllerlar

## ⚡ Bir qarashda

| # | Mavzu | Bir gapda |
|---|---|---|
| 1 | Router | Har bir manzilni **kerakli xonaga** yo'naltiruvchi yo'lboshchi |
| 2 | MVC pattern | Loyihani **3 bo'limga** bo'lib, tartibli qilish usuli |
| 3 | Member controller | Foydalanuvchilar (a'zolar) bilan ishlaydigan bo'lim |
| 4 | Restoran controller | Restoranlar bilan ishlaydigan bo'lim |

---

## 1️⃣ Router nima?

### Muammo

`server.ts` faylida hammasini yozsang, u juda **shishib ketadi**:

```ts
app.get("/odam", ...)
app.post("/odam", ...)
app.get("/restoran", ...)
app.post("/restoran", ...)
app.delete("/restoran/:id", ...)
// ... yana 50 ta qator
```

Bu xuddi **bitta xonada** oshxona, yotoqxona, hammom — hammasini joylashtirishga o'xshaydi. Noqulay!

### Yechim: Router

**Router** — bu uyning **har bir xonasiga alohida eshik** qo'yish. Har bir mavzu (odamlar, restoranlar) o'z faylida, o'z "kichik serverida" yashaydi, keyin katta serverga **ulanadi**.

### Qanday ishlaydi?

```
so'rov keladi → server.ts → tegishli Router → tegishli funksiya → javob
```

Xuddi katta binoning **qorovuli** kabi: kimdir kelsa, "sizga qaysi xona kerak?" deb so'raydi va o'sha xonaga yo'naltiradi.

### Kod bilan

**`src/routers/odamRouter.ts`:**

```ts
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hamma odamlar");
});

router.post("/", (req, res) => {
  res.send("Yangi odam qo'shildi");
});

export default router;
```

**`src/server.ts`:**

```ts
import express from "express";
import odamRouter from "./routers/odamRouter";

const app = express();

app.use("/odam", odamRouter); // "/odam" bilan boshlangan hamma so'rov shu yerga boradi

app.listen(3000);
```

Endi `GET /odam` so'rovi kelsa, Express avtomatik `odamRouter.ts` ichidagi `router.get("/", ...)` ni ishga tushiradi. Manzil (`/odam`) va ichki yo'l (`/`) qo'shilib, **to'liq manzil** hosil bo'ladi.

---

## 2️⃣ MVC pattern (eslatma + chuqurroq)

Oldingi darsda restoran misolida ko'rgan edik. Endi kodga tushiramiz.

| Harf | Nomi | Vazifasi | Restoranda |
|---|---|---|---|
| **M** | Model | Ma'lumotni saqlash qoidasi (Schema) | Oshxona ombori |
| **V** | View | Foydalanuvchiga ko'rinadigan javob (bizda — JSON) | Dasturxon |
| **C** | Controller | Ish mantig'i: nima qilish kerakligini **hal qiladi** | Ofitsiant |

### Nega kerak?

Agar hammasini bitta faylga yozsang, keyinchalik **bittasini topib, tuzatish** qiynchilik bo'ladi. MVC esa har bir narsani **o'z joyiga** qo'yadi — xuddi kiyimlaringni javonga tartib bilan terib qo'yganingdek, keyin kerakli kiyimni tez topasan.

### Papka tuzilmasi

```
src/
├─ models/
│   ├─ Odam.ts          ← M (schema)
│   └─ Restoran.ts
├─ controllers/
│   ├─ odamController.ts   ← C (mantiq)
│   └─ restoranController.ts
├─ routers/
│   ├─ odamRouter.ts       ← qaysi manzil qaysi controllerga boradi
│   └─ restoranRouter.ts
└─ server.ts
```

**Oqim:**

```
so'rov → Router → Controller → Model (bazadan olish/yozish) → Controller → javob (View)
```

---

## 3️⃣ Member controller (odamlar bilan ishlash)

"Member" — a'zo, ya'ni saytga ro'yxatdan o'tgan odam.

**`src/models/Member.ts`:**

```ts
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  ism: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model("Member", memberSchema);
```

**`src/controllers/memberController.ts`:**

```ts
import { Request, Response } from "express";
import Member from "../models/Member";

// Hamma a'zolarni olish
export const getMembers = async (req: Request, res: Response) => {
  const hammasi = await Member.find();
  res.send(hammasi);
};

// Yangi a'zo qo'shish
export const createMember = async (req: Request, res: Response) => {
  const yangiMember = new Member(req.body);
  await yangiMember.save();
  res.send(yangiMember);
};
```

**`src/routers/memberRouter.ts`:**

```ts
import { Router } from "express";
import { getMembers, createMember } from "../controllers/memberController";

const router = Router();

router.get("/", getMembers);
router.post("/", createMember);

export default router;
```

**`server.ts`ga qo'shamiz:**

```ts
import memberRouter from "./routers/memberRouter";
app.use("/member", memberRouter);
```

> 🔍 **Nega funksiyalarni alohida faylga (controller) chiqardik?** Chunki router faqat "qaysi manzil qayerga boradi"ni bilishi kerak, **nima qilishni** bilishi shart emas. Xuddi ofitsiant taomni **o'zi pishirmaydi**, oshpazga (controller) topshiradi.

---

## 4️⃣ Restoran controllerni yasaymiz

Endi xuddi shu qolipni **Restoran** uchun takrorlaymiz. Bu — MVC'ning eng katta kuchi: bir marta qolipni o'rgansang, istalgan mavzuga qo'llay olasan.

**`src/models/Restoran.ts`:**

```ts
import mongoose from "mongoose";

const restoranSchema = new mongoose.Schema({
  nomi: { type: String, required: true },
  manzil: { type: String, required: true },
  reyting: { type: Number, default: 0 },
});

export default mongoose.model("Restoran", restoranSchema);
```

**`src/controllers/restoranController.ts`:**

```ts
import { Request, Response } from "express";
import Restoran from "../models/Restoran";

// Hamma restoranlarni olish
export const getRestoranlar = async (req: Request, res: Response) => {
  const hammasi = await Restoran.find();
  res.send(hammasi);
};

// Bitta restoranni ID orqali olish
export const getRestoranById = async (req: Request, res: Response) => {
  const restoran = await Restoran.findById(req.params.id);
  res.send(restoran);
};

// Yangi restoran qo'shish
export const createRestoran = async (req: Request, res: Response) => {
  const yangiRestoran = new Restoran(req.body);
  await yangiRestoran.save();
  res.send(yangiRestoran);
};

// Restoranni o'chirish
export const deleteRestoran = async (req: Request, res: Response) => {
  await Restoran.findByIdAndDelete(req.params.id);
  res.send({ xabar: "Restoran o'chirildi" });
};
```

**`src/routers/restoranRouter.ts`:**

```ts
import { Router } from "express";
import {
  getRestoranlar,
  getRestoranById,
  createRestoran,
  deleteRestoran,
} from "../controllers/restoranController";

const router = Router();

router.get("/", getRestoranlar);
router.get("/:id", getRestoranById);
router.post("/", createRestoran);
router.delete("/:id", deleteRestoran);

export default router;
```

**`server.ts`ga qo'shamiz:**

```ts
import restoranRouter from "./routers/restoranRouter";
app.use("/restoran", restoranRouter);
```

> 🆔 **`:id` nima?** Bu — **dinamik parametr**. `/restoran/123` desa, Express `req.params.id` ichiga `"123"` ni joylab beradi. Xuddi shablonda bo'sh joy qoldirib, keyin ismini yozganga o'xshaydi.

---

## 🧩 Yakuniy papka ko'rinishi

```
src/
├─ models/
│   ├─ Member.ts
│   └─ Restoran.ts
├─ controllers/
│   ├─ memberController.ts
│   └─ restoranController.ts
├─ routers/
│   ├─ memberRouter.ts
│   └─ restoranRouter.ts
└─ server.ts
```

```ts
// server.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import memberRouter from "./routers/memberRouter";
import restoranRouter from "./routers/restoranRouter";

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL as string)
  .then(() => console.log("MongoDB ga ulandik ✅"));

app.use("/member", memberRouter);
app.use("/restoran", restoranRouter);

app.listen(process.env.PORT, () => console.log("Server ishga tushdi"));
```

---

## 📝 O'zimni tekshiraman

1. Router nima uchun kerak, hammasini `server.ts`ga yozib bo'lmaydimi?
2. MVC'da M, V, C nimani anglatadi va har biri nima ish qiladi?
3. Controller bilan Router orasidagi farq nima?
4. `/restoran/:id` dagi `:id` nima uchun kerak?





# | 52 | # 📘 Express va MongoDB (Mongoose orqali) ⚡ Bir qarashda

| # | Mavzu | Bir gapda |
|---|---|---|
| 1 | Express | Serverni oson quradigan **yordamchi** |
| 2 | MongoDB | Ma'lumotlarni saqlaydigan **ombor** |
| 3 | Mongoose | MongoDB bilan gaplashadigan **tarjimon** |

---

## 1️⃣ Express nima?

Tasavvur qil: sen **restoran** ochmoqchisan. Node.js senga g'isht, sement, hamma narsa beradi — lekin uydan boshlab qurishing kerak. **Express** esa senga tayyor **karkas uy** beradi: eshiklari, xonalari tayyor, sen faqat jihozlab, kerakli xonaga kerakli buyumni qo'yasan.

Ya'ni Express — bu server (dastur) qurishni **osonlashtiradigan** yordamchi kutubxona.

### O'rnatish

Terminalda, loyiha papkasida (`package.json` turgan joyda):

```bash
npm install express
```

TypeScript bilan ishlaganda turlar (types) ham kerak:

```bash
npm install -D @types/express
```

### Eng oddiy server

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Salom, dunyo!");
});

app.listen(3000, () => {
  console.log("Server 3000-portda ishga tushdi");
});
```

- `app.get("/", ...)` — kimdir brauzerda saytga kirsa, shu funksiya ishlaydi
- `req` — **so'rov** (kimdir nima so'rayapti)
- `res` — **javob** (biz unga nima qaytaramiz)
- `app.listen(3000)` — server 3000-eshikda (port) "qo'ng'iroqlarni kutib" turadi

> 🚪 **Port** — bu uyning eshigi raqami. Kompyuterda ko'plab eshik bor, server o'shalardan birida turadi.

---

## 2️⃣ MongoDB nima?

Oddiy ma'lumotlar bazasi (masalan, Excel jadvali)da hammasi **qat'iy ustunlarga** bo'lingan: ism, yosh, telefon — hammaning ustunlari bir xil bo'lishi shart.

**MongoDB** esa boshqacha ishlaydi: u ma'lumotni **quti (JSON'ga o'xshash) ichida** saqlaydi, va har bir quti bir-biridan farq qilishi mumkin:

```json
{ "ism": "Ali", "yosh": 10 }
{ "ism": "Vali", "yosh": 12, "sevimliRang": "ko'k" }
```

Ikkalasi ham "odam" degan quti, lekin ikkinchisida qo'shimcha maydon bor — va bu **mumkin**. Shuning uchun MongoDB tez o'zgaradigan loyihalarga juda qulay.

### Atamalar (Excel bilan solishtiramiz)

| Excel | MongoDB |
|---|---|
| Fayl | **Database** (ma'lumotlar bazasi) |
| Varaq (list) | **Collection** (to'plam) |
| Qator | **Document** (hujjat) |

---

## 3️⃣ Mongoose nima?

Node.js dasturi MongoDB bilan **to'g'ridan-to'g'ri** gaplasha olmaydi, chunki ular boshqa-boshqa "tilda" so'zlashadi. **Mongoose** — bu ikkalasi orasidagi **tarjimon**.

U yana bitta foyda beradi: **Schema** (sxema) orqali har bir "quti" qanday ko'rinishda bo'lishini oldindan belgilab qo'yasan — xuddi 3-darsdagi `interface` kabi.

### O'rnatish

```bash
npm install mongoose
```

### 1-qadam: Ulanish

`src/server.ts` yoki alohida `db.ts` faylida:

```ts
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/burak")
  .then(() => console.log("MongoDB ga ulandik ✅"))
  .catch((xato) => console.log("Ulanishda xato ❌", xato));
```

- `mongodb://127.0.0.1:27017` — kompyuteringizda ishlab turgan MongoDB manzili
- `burak` — database nomi (o'zing tanlaysan, mavjud bo'lmasa, o'zi yaratiladi)

> 💻 Bu manzil **kompyuteringda o'rnatilgan** MongoDB uchun. Agar bulutdagi (MongoDB Atlas) bazadan foydalansang, manzil boshqacha bo'ladi — bu haqda alohida gaplashamiz.

### 2-qadam: Schema va Model yasash

**Schema** = "anketa" (nimalar bo'lishi kerakligini aytadi)
**Model** = shu anketa asosida ma'lumot yaratish/o'qish vositasi

```ts
import mongoose from "mongoose";

// 1. Anketa
const odamSchema = new mongoose.Schema({
  ism: { type: String, required: true },
  yosh: { type: Number, required: true },
});

// 2. Model (anketadan foydalanadigan vosita)
const Odam = mongoose.model("Odam", odamSchema);

export default Odam;
```

### 3-qadam: Ma'lumot qo'shish va olish

```ts
// Yangi odam qo'shish
const yangiOdam = new Odam({ ism: "Ali", yosh: 10 });
await yangiOdam.save();

// Hamma odamlarni olish
const hammasi = await Odam.find();
console.log(hammasi);
```

---

## 🧩 Hammasi birga (kichik misol)

```ts
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json()); // kelgan ma'lumotni JSON deb tushunish uchun

// Mongoose bilan ulanish
mongoose.connect("mongodb://127.0.0.1:27017/burak")
  .then(() => console.log("MongoDB ga ulandik ✅"));

// Schema va Model
const odamSchema = new mongoose.Schema({
  ism: { type: String, required: true },
  yosh: { type: Number, required: true },
});
const Odam = mongoose.model("Odam", odamSchema);

// Yangi odam qo'shadigan yo'l (route)
app.post("/odam", async (req, res) => {
  const yangiOdam = new Odam(req.body);
  await yangiOdam.save();
  res.send(yangiOdam);
});

// Hamma odamlarni ko'rsatadigan yo'l
app.get("/odam", async (req, res) => {
  const hammasi = await Odam.find();
  res.send(hammasi);
});

app.listen(3000, () => console.log("Server 3000-portda"));
```

---

## 📝 O'zimni tekshiraman

1. Express nima uchun kerak?
2. MongoDB'da "Collection" Excel'dagi nimaga o'xshaydi?
3. Mongoose nima ish qiladi?
4. Schema bilan Model orasidagi farq nima?








# | 51 | # 📘 Environment Variable va Yangi Database ⚡ Bir qarashda

| # | Mavzu | Bir gapda |
|---|---|---|
| 1 | Environment Variable | Maxfiy ma'lumotlarni kodning **tashqarisida** saqlash |
| 2 | Yangi database | Burak loyihasi uchun **o'ziga xos** MongoDB bazasi ochish |

---

## 1️⃣ Environment Variable nima?

### Muammo

O'tgan darsda shunday yozgan edik:

```ts
mongoose.connect("mongodb://127.0.0.1:27017/burak");
```

Manzil to'g'ridan-to'g'ri kod ichida yozilgan. Bu ikkita muammo tug'diradi:

1. Agar bu **parol** yoki **maxfiy kalit** bo'lsa-chi? Kodni GitHub'ga yuklaganingda hamma ko'radi. 🔓
2. Uyda ishlaganda bir manzil, ishga (production) chiqarganda boshqa manzil kerak bo'ladi. Har safar kodni o'zgartirasanmi?

### Yechim: Environment Variable

Tasavvur qil: sening kalitlaring (uy kaliti, seyf kaliti) bor. Ularni devorga osib qo'ymaysan, **maxsus qutichada**, ko'zdan uzoqda saqlaysan. Kerak bo'lganda o'sha qutidan olasan.

**Environment variable** — bu ham xuddi shunday: maxfiy va o'zgaruvchan ma'lumotlarni kod ichiga emas, **alohida faylga** yozib qo'yamiz.

### `.env` fayli

Loyiha ildizida (`package.json` bilan bir joyda) `.env` nomli fayl yaratamiz:

```
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/burak
```

> ⚠️ Bu fayl ichida **bo'sh joy, tirnoq belgisi kerak emas**: `PORT=3000`, `PORT = 3000` emas.

### O'rnatish

```bash
npm install dotenv
```

TypeScript bilan ishlasak, turlar kerak emas — `dotenv` o'zida bor.

### Ishlatish

`src/server.ts` faylining **eng boshida**:

```ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

const app = express();

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl as string)
  .then(() => console.log("MongoDB ga ulandik ✅"));

app.listen(port, () => console.log(`Server ${port}-portda`));
```

- `process.env.PORT` — `.env` faylidan `PORT` degan qiymatni o'qiydi
- `dotenv.config()` — `.env` faylini o'qib, `process.env` ichiga joylashtiradi. Shuning uchun bu qator **eng birinchi** turishi kerak, aks holda boshqa qatorlar hali bo'sh qutidan olishga urinadi

### 🔒 Muhim: `.env` ni hech qachon GitHub'ga yubormaymiz!

Loyiha ildizida `.gitignore` nomli fayl bor (yo'q bo'lsa, yarat) va ichiga shuni yoz:

```
node_modules
.env
```

Bu Git'ga "bu fayllarni ko'rmaslikni" buyuradi. Shunda maxfiy ma'lumotlaring xavfsiz qoladi.

### Boshqalar uchun namuna: `.env.example`

Boshqa dasturchi (yoki sen o'zing kelajakda) loyihani ochganda, qanday o'zgaruvchilar kerakligini bilishi uchun, qiymatlarsiz namuna fayl qoldiramiz:

```
PORT=
MONGO_URL=
```

Bu faylni (`.env.example`) GitHub'ga yuklash **mumkin**, chunki ichida maxfiy narsa yo'q.

---

## 2️⃣ Burak uchun yangi database yaratish

MongoDB'da database'ni oldindan "yaratish" shart emas — **birinchi marta ma'lumot yozganingda** o'zi paydo bo'ladi. Xuddi bo'sh papkaga birinchi faylni tashlaganingda, papka "to'lib" boshlagani kabi.

### Agar kompyuteringda MongoDB o'rnatilgan bo'lsa

`.env` faylida database nomini xohlaganingcha o'zgartirasan:

```
MONGO_URL=mongodb://127.0.0.1:27017/burak_db
```

`burak_db` — bu yangi database nomi. `mongoose.connect()` shu manzilga ulanganda, MongoDB avtomatik shu nomli bazani yaratadi (birinchi ma'lumot yozilganda).

### Agar bulutdan (MongoDB Atlas) foydalanmoqchi bo'lsang

MongoDB Atlas — bu MongoDB'ni **o'zing o'rnatmasdan**, internetda bepul ishlatish imkonini beruvchi xizmat. Qadamlar:

1. [mongodb.com/cloud/atlas](https://mongodb.com) saytida bepul akkaunt och
2. Yangi **Cluster** (bazalar guruhi) yarat
3. **Database Access** bo'limida foydalanuvchi nomi va parol o'rnat
4. **Network Access** bo'limida o'z IP manzilingga ruxsat ber (yoki test uchun "Allow from anywhere")
5. **Connect** tugmasini bosib, ulanish manzilini (connection string) nusxa ol — u shunga o'xshaydi:

```
mongodb+srv://foydalanuvchi:parol@cluster0.mongodb.net/burak_db
```

6. Shu manzilni `.env` fayliga qo'y:

```
MONGO_URL=mongodb+srv://foydalanuvchi:parol@cluster0.mongodb.net/burak_db
```

Kodni o'zgartirish shart emas — `process.env.MONGO_URL` avtomatik yangi manzilni o'qiydi.

---

## 🧩 Hammasi birga

```
BURAK/
├─ .env                ← maxfiy, GitHub'ga bormaydi
├─ .env.example         ← namuna, GitHub'ga boradi
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ src/
   └─ server.ts
```

```ts
// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL as string;

mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB ga ulandik ✅"))
  .catch((xato) => console.log("Xato ❌", xato));

app.get("/", (req, res) => res.send("Salom, Burak!"));

app.listen(port, () => console.log(`Server ${port}-portda`));
```

---

## 📝 O'zimni tekshiraman

1. Nima uchun manzil va parolni to'g'ridan-to'g'ri kod ichiga yozmaymiz?
2. `.env` faylini nima uchun `.gitignore`ga qo'shamiz?
3. Yangi database'ni MongoDB'da qanday "yaratamiz"?
4. `dotenv.config()` qatori nima uchun faylning **eng boshida** turishi kerak?


(======++=====================++===================+=========+=======++======);




(=================================================================================================================);


# | 50 | # 📘 TypeScript va Patternlar
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


(==================================================================================);



