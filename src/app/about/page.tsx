import { Button } from "@/components/ui/button";
import React from "react";
import { Star, Zap, Shield, Users, BarChart3, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="max-w-[1200px] m-auto">
      <section className="py-20 md:py-30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              <span className="text-[#2c94a1]"> Духтури мо </span>— ҳамроҳ ба
              саломатии беҳтар
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Шифокори боэътимод ва ботаҷриба барои нигоҳдории саломатии
              шумо.Духтури дилсӯз ва касбӣ барои беҳбудии ҳаёти шумо
            </p>

            <Link href={"/doctors"}>
              <Button
                size="lg"
                className="hover:bg-teal-800 cursor-pointer bg-[#2c94a1] px-8"
              >
                Қайд шудан
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="pt-8">
              <Image
                src="/sitting-and-smiling-doctor-with-little-baby-is-wo-2025-03-18-21-04-12-YZR9FJZ-1024x683.jpg"
                alt="StreamLine Dashboard"
                width={800}
                height={400}
                className="rounded-lg shadow-2xl border"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ҳамаи имкониятҳо барои табиби касбӣ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Имкониятҳои пуриқтидор барои беҳтар сохтани ҳамкории гурӯҳи тиббӣ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Автоматикунонии зирак</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Системае, ки одатҳои шуморо меомӯзад ва корҳои якхеларо худкор
                  анҷом медиҳад.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Амнияти сатҳи корхона</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Сатҳи олитарини амният барои ташкилотҳо — бо стандартҳои
                  ҷаҳонӣ ва муҳофизати боэътимод.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Ҳамкории даставӣ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Воситаҳои ҳамкории онлайнӣ дар вақти воқеӣ, ки дастаи шуморо
                  ҳамоҳанг ва самаранок нигоҳ медоранд.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Таҳлили пешрафта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Иттилооти муфассал ва ҳисоботҳо барои беҳсозии ҷараёни кор ва
                  назорати самаранокӣ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Дӯстдошта аз ҷониби дастаҳо дар саросари ҷаҳон
            </h2>
            <p className="text-xl text-muted-foreground">
              Бубинед, ки муштариёни мо дар бораи Darmon чӣ мегӯянд
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription>
                  "Darmon комилан равиши кори моро тағйир дод. Мо кори дастиро
                  80% коҳиш додем ва ҳосилнокии даста бештар аз ҳарвақта шуд."
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold">Сара Ҷонсон</p>
                    <p className="text-sm text-muted-foreground">
                      СЕО, TechCorp
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription>
                  "Функсияҳои автоматикунонӣ аҷоибанд. Он чизе, ки пештар соатҳо
                  вақт мегирифт, ҳоло худкор иҷро мешавад. Рӯёндани фоида
                  аллакай дар моҳи аввал оғоз шуд."
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold">Майкл Чен</p>
                    <p className="text-sm text-muted-foreground">
                      Директори амалиёт, StartupXYZ
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription>
                  "Дастгирии муштариёни Darmon беҳамто аст. Платформа фаҳмо ва
                  осон аст ва натиҷаҳо худ гувоҳӣ медиҳанд — 300% афзоиши
                  ҳосилнокӣ!"
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold">Эмили Родригес</p>
                    <p className="text-sm text-muted-foreground">
                      Мудири лоиҳа, GlobalTech
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
