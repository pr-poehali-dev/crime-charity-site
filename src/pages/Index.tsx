import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const { toast } = useToast();

  const donationPackages = [
    {
      id: 1,
      name: "Стартовый",
      price: "100₽",
      amount: 100,
      icon: "Coins",
      features: [
        "100.000.000₽ игровых",
        "Мгновенная выдача",
      ],
      popular: false,
      color: "from-zinc-700 to-zinc-800"
    },
    {
      id: 2,
      name: "Продвинутый",
      price: "200₽",
      amount: 200,
      icon: "Wallet",
      features: [
        "300.000.000₽ игровых",
        "Мгновенная выдача",
      ],
      popular: false,
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 3,
      name: "Премиум",
      price: "400₽",
      amount: 400,
      icon: "Gem",
      features: [
        "500.000.000₽ игровых",
        "Мгновенная выдача",
      ],
      popular: true,
      color: "from-purple-600 to-purple-800"
    },
    {
      id: 4,
      name: "Элитный",
      price: "500₽",
      amount: 500,
      icon: "Crown",
      features: [
        "900.000.000₽ игровых",
        "Мгновенная выдача",
      ],
      popular: false,
      color: "from-orange-600 to-orange-800"
    },
    {
      id: 5,
      name: "Админ Набор",
      price: "100₽",
      amount: 100,
      icon: "ShieldCheck",
      features: [
        "Админские команды",
        "Инструменты модерации",
        "Эксклюзивный доступ",
      ],
      popular: false,
      color: "from-red-600 to-red-800"
    },
  ];

  const handleBuyClick = (pkg: any) => {
    setSelectedPackage(pkg);
    setNickname("");
  };

  const handlePurchase = () => {
    if (!nickname.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ваш игровой никнейм",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = "79800566890";
    const amount = selectedPackage.amount;
    const message = `Донат: ${selectedPackage.name} для ${nickname}`;
    
    const sbpUrl = `https://qr.nspk.ru/proverkacheka.html?t=${Date.now()}&s=${amount}&m=${phoneNumber}&n=${encodeURIComponent(message)}`;
    
    window.open(sbpUrl, '_blank');

    toast({
      title: "Переход к оплате",
      description: `Откроется окно для перевода ${amount}₽ через СБП`,
    });

    setSelectedPackage(null);
    setNickname("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://cdn.poehali.dev/projects/ba843225-a5ea-4c54-acb7-a1dd7ce9f8cd/files/795c318b-e4a0-4087-9c3f-279f2a1a876c.jpg')`
        }}
      >
        <div className="text-center z-10 px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
            CRIME RUSSIA
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Криминальная Россия • Ролевой Сервер
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              <span>1,247 игроков онлайн</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Gamepad2" size={20} />
              <span>GTA V RP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">ДОНАТ ПАКЕТЫ</h2>
          <p className="text-muted-foreground text-lg">
            Поддержи сервер и получи эксклюзивные преимущества
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {donationPackages.map((pkg, index) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                pkg.popular 
                  ? 'border-primary animate-glow' 
                  : 'border-border hover:border-primary/50'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-bold">
                    ПОПУЛЯРНО
                  </Badge>
                </div>
              )}
              
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${pkg.color} opacity-80`} />
              
              <CardHeader className="relative z-10 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center border-2 border-primary">
                    <Icon name={pkg.icon} size={32} className="text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-center">{pkg.name}</CardTitle>
                <CardDescription className="text-center">
                  <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon name="Check" size={18} className="text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                <Button 
                  onClick={() => handleBuyClick(pkg)}
                  className={`w-full mt-6 font-bold text-lg h-12 bg-gradient-to-r ${pkg.color} hover:opacity-90 transition-all`}
                >
                  Купить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Shield" size={18} />
            <span>Безопасная оплата • Мгновенная выдача</span>
          </p>
        </div>
      </div>

      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name={selectedPackage?.icon || "Package"} size={24} className="text-primary" />
              {selectedPackage?.name}
            </DialogTitle>
            <DialogDescription>
              Введите ваш игровой никнейм для получения доната
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-base">
                Игровой никнейм
              </Label>
              <Input
                id="nickname"
                placeholder="Введите ваш ник в игре"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Убедитесь, что никнейм указан правильно
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пакет:</span>
                <span className="font-semibold">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Цена:</span>
                <span className="font-bold text-primary text-lg">{selectedPackage?.price}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedPackage(null)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 font-bold"
            >
              Перейти к оплате
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;