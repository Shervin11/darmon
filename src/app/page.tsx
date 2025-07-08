import { Button } from "@/components/ui/button";
import Card from "@/components/card/page";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 max-w-[1440npx shadcn@latest add badgepx] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Хизматрасонии касбии тиббӣ барои саломатии комили шумо
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              Мо уҳдадор ҳастем, ки бо кӯмаки дастаи мутахассисони
              баландихтисоси тиббӣ ва технологияи пешрафтаи тиббӣ, хизматрасонии
              босифати тандурустиро пешниҳод намоем.
            </p>

            <Link href={"/doctors"}>
              <Button
                variant="outline"
                className="border-white text-whitehover:text-teal-600 h-[50px] cursor-pointer w-[180px] text-xl bg-transparent"
              >
                Қайд шудан
              </Button>
            </Link>
          </div>
          <div>
            <div>
              <Image
                src="/healthcare-smile-and-portrait-of-doctor-man-in-h-2023-11-27-05-17-56-FQW3ASA-819x1024.png"
                alt="Professional doctor with stethoscope and white coat"
                width={500}
                height={600}
                className="w-full h-auto object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-[1440px] m-auto top-[-120px]">
        <div className="flex lg:flex-row flex-col items-center gap-8 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-100 to-teal-200 lg:h-[410px] rounded-3xl p-8 overflow-hidden">
            <div className="h-full flex flex-col justify-center">
              <div className="text-6xl font-bold text-gray-800 mb-4">15+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Солҳои Таҷриба
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Мо солҳо таҷрибаи касбӣ дорем дар соҳаи тандурустӣ, бо садҳо
                мизоҷи қонеъшуда.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 w-full flex lg:flex-row flex-col items-center justify-between lg:h-[410px] rounded-3xl p-8 overflow-hidden">
            <div className="h-full flex flex-col justify-center pr-12">
              <h2 className="text-4xl lg:text-4xl lg:mb-[60px] font-bold text-gray-800 mb-4 leading-tight">
                Ба ҷомеаи рушдёбандаи тандурустӣ ва некӯаҳволӣ ҳамроҳ шавед.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Беш аз 1 миллион корбар ба Romedic барои ниёзҳои тиббии худ
                бовар доранд.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-100 rounded-2xl p-6 text-center h-40 flex flex-col justify-center">
                <div className="text-6xl font-bold text-teal-500 mb-2">35+</div>
                <p className="text-gray-600 font-medium text-lg">
                  Махсусиятҳои тиббӣ
                </p>
              </div>

              <div className="bg-gray-100 rounded-2xl p-6 text-center h-40 flex flex-col justify-center">
                <div className="text-6xl font-bold text-teal-500 mb-2">20+</div>
                <p className="text-gray-600 font-medium text-lg">
                  Ҳуҷраҳои бемористон
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
            Технология ва таҷҳизот
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="h-56 relative">
                <Image
                  src="/uzi.png"
                  alt="УЗИ таҷҳизот"
                  width={400}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-2">Таҷҳизоти УЗИ</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  УЗИ Aplio 400
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Дастгоҳи УЗИ-и дараҷаи баланд бо тасвири равшан, коркарди
                  самаранок ва консоле, ки ба осонӣ мутобиқ мешавад ба талаботи
                  корбар
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="h-56 relative">
                <Image
                  src="/sim.png"
                  alt="Дастгоҳи колоноскопӣ"
                  width={400}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-2">
                  Дастгоҳи колоноскопӣ
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Olympus cF-Q150l
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  CF-Q150 L — ин колоновидеоскопи касбӣ барои ташхиси рӯдаи ғафс
                  бо канали асбобии васеъ (3,7 мм) ва диаметри қубури
                  воридшаванда 12,8 мм
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="h-56 relative">
                <Image
                  src="/rengen.png"
                  alt="Таҷҳизоти рентгенӣ"
                  width={400}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-2">Таҷҳизоти рентгенӣ</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  ПроГраф 5000
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  ПроГраф-5000 бо сохтори штативи навъи «С-дуга» барои
                  гузаронидани муоинаи флюорографиии узвҳои қафаси синаи бемор
                  дар проексияҳои рост ва паҳлӯ дар ҳолати ростистода пешбинӣ
                  шудааст ва сабти рақамии тасвирро таъмин мекунад
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Маълумоти кӯтоҳ дар бораи маркази тиббии мо
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Муассисаи тиббии амбулаториву поликлиникаи бисёрсоҳа барои
                кӯдакон ва калонсолон дар шаҳри Мытищи. Мо хизматрасониҳои
                пулакии тиббӣ пешниҳод мекунем ва яке аз пешсафони муассисаҳои
                тиббии шаҳри Мытищи мебошем. Ҳар сол зиёда аз 150 000 нафар
                беморон дар маркази мо хизмат мегиранд.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/hero2.png"
                alt="Маркази тиббӣ"
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="bg-teal-50 rounded-2xl p-8 mb-[100px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                h={
                  <span className="flex items-center">
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    10
                  </span>
                }
                p={"лет заботы о вашем здоровье"}
              />
              <Card h={150} p={"квалифицированных специалистов"} />
              <Card h={3000} p={"медицинских услуг по всем направлениям"} />
              <Card
                h={"День в день"}
                p={"прием врача любой специальности в день обращения"}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
