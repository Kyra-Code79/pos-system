import Link from "next/link";
import { getLandingPageContent } from "@/lib/actions/landing";
import { getStoreSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, BarChart3, ShieldCheck, ShoppingCart, Users, Settings, Check, Star } from "lucide-react";
import Image from "next/image";

// Map string icon names to Lucide components
const iconMap: any = {
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  ShoppingCart,
  Users,
  Settings
};

export default async function LandingPage() {
  const content = await getLandingPageContent();
  const settings = await getStoreSettings();
  const features = Array.isArray(content?.features) ? content.features : [];
  const heroImage = content?.heroImage || "/pos-tab.png";
  const pricingPlans = Array.isArray(content?.pricingPlans) && content.pricingPlans.length > 0
    ? content.pricingPlans
    : [
      // Fallback defaults if DB is empty
      {
        name: "Basic",
        price: "$20",
        features: ["1 Outlet", "Basic Reports", "Unlimited Products"],
        highlight: false
      },
      {
        name: "Business",
        price: "$30",
        features: ["3 Outlets", "Advanced Analytics", "Inventory Management", "24/7 Support"],
        highlight: true
      },
      {
        name: "Enterprise",
        price: "$50",
        features: ["Unlimited Outlets", "Custom Reports", "API Access"],
        highlight: false
      }
    ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <header className="px-6 h-20 flex items-center fixed w-full bg-[#0f172a]/90 backdrop-blur-md z-50 border-b border-white/10">
        <div className="mr-8 flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-[#00C853] rounded-md flex items-center justify-center text-white font-bold">
            K
          </div>
          <span>{settings?.storeName || "K.Inc POS"}</span>
        </div>
        <nav className="hidden md:flex ml-auto items-center gap-8 text-sm font-medium">
          <Link className="hover:text-[#00C853] transition-colors" href="#features">Feature</Link>
          <Link className="hover:text-[#00C853] transition-colors" href="#pricing">Pricing</Link>
          <Link className="hover:text-[#00C853] transition-colors" href="#contact">Contact</Link>
          <div className="flex items-center gap-4 ml-4">
            <Link href="/login" className="hover:text-[#00C853] transition-colors">Login</Link>
            <Button asChild className="bg-[#00C853] hover:bg-[#00b34a] text-white rounded-full px-6">
              <Link href="/login">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                    {content?.heroTitle || "One Cashier App For All Types Of Business"}
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {content?.heroDescription || "A cloud-based online cashier application that can take your business potential to the highest level, both online and offline."}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button asChild size="lg" className="bg-[#00C853] hover:bg-[#00b34a] text-white h-12 px-8 rounded-full text-base">
                    <Link href="/login">
                      Free Download
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto w-full max-w-[600px] lg:max-w-none relative">
                {/* Tablet Mockup */}
                <div className="relative z-10 transform translate-x-12 translate-y-6 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 ease-out">
                  <Image
                    src={heroImage}
                    alt="POS Interface"
                    width={800}
                    height={600}
                    className="drop-shadow-2xl rounded-[2rem] border-[8px] border-gray-800 bg-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-white text-slate-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Manage Your Business</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Complete features for unlimited outlets and employees. All integrated in 1 hand, 1 app.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-start">
              <div className="relative rounded-xl overflow-hidden bg-slate-100 p-8 min-h-[400px] flex items-center justify-center">
                {/* Feature Visual Placeholder */}
                <LayoutDashboard className="h-32 w-32 text-slate-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent"></div>
              </div>

              <div className="space-y-8">
                {features.length > 0 ? features.map((feature: any, index: number) => {
                  const Icon = iconMap[feature.icon] || LayoutDashboard;
                  return (
                    <div key={index} className="flex gap-4 group cursor-pointer">
                      <div className="mt-1 bg-white p-2 rounded-full shadow-sm border group-hover:border-[#00C853] transition-colors">
                        <Icon className="h-6 w-6 text-[#00C853]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-[#00C853] transition-colors">{feature.title}</h3>
                        <p className="text-slate-500 mt-2">{feature.description}</p>
                      </div>
                    </div>
                  )
                }) : (
                  <>
                    <div className="flex gap-4">
                      <div className="mt-1 bg-white p-2 rounded-full shadow-sm border"><Users className="h-6 w-6 text-[#00C853]" /></div>
                      <div>
                        <h3 className="text-xl font-bold">Any Business, One App</h3>
                        <p className="text-slate-500 mt-2">Complete features for unlimited outlets and employees.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-1 bg-white p-2 rounded-full shadow-sm border"><BarChart3 className="h-6 w-6 text-[#00C853]" /></div>
                      <div>
                        <h3 className="text-xl font-bold">Focus on Selling</h3>
                        <p className="text-slate-500 mt-2">You focus on selling, we manage the rest. Always there for you.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 bg-slate-50 text-slate-900 border-t">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Plan For Every Business</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan: any, index: number) => (
                <div
                  key={index}
                  className={`${plan.highlight ? 'bg-[#0f172a] text-white border-[#00C853] relative transform md:-translate-y-4 shadow-xl border-2' : 'bg-white text-slate-900 shadow-sm border hover:shadow-lg transition-shadow'} p-8 rounded-2xl`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 bg-[#00C853] text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-bold">BEST VALUE</div>
                  )}
                  <h3 className={`font-semibold text-lg ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.name}</h3>
                  <div className="mt-4"><span className="text-4xl font-bold">{plan.price}</span><span className="text-slate-400">/mo</span></div>
                  <ul className="mt-8 space-y-4">
                    {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        {plan.highlight ? (
                          <div className="bg-[#00C853] rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>
                        ) : (
                          <Check className="h-4 w-4 text-[#00C853]" />
                        )}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-8 ${plan.highlight ? 'bg-[#00C853] hover:bg-[#00b34a] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-0'}`}>
                    Choose Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section id="contact" className="w-full py-12 md:py-24 bg-white border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-slate-900">
                Contact Us
              </h2>
              <p className="mx-auto max-w-[600px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Need help? Reach out to our support team.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center py-4 text-slate-700">
              {(settings as any)?.storeAddress && (
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">Address</p>
                  {(settings as any).storeAddress}
                </div>
              )}
              {(settings as any)?.storeEmail && (
                <div className="text-sm border-l border-slate-200 pl-4 ml-4">
                  <p className="font-semibold text-slate-900">Email</p>
                  <a href={`mailto:${(settings as any).storeEmail}`} className="hover:underline">{(settings as any).storeEmail}</a>
                </div>
              )}
              {(settings as any)?.storePhone && (
                <div className="text-sm border-l border-slate-200 pl-4 ml-4">
                  <p className="font-semibold text-slate-900">Phone</p>
                  {(settings as any).storePhone}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-slate-50 text-slate-500">
        <p className="text-xs">
          &copy; 2025 <a href="https://github.com/Kyra-Code79" className="hover:underline">Kyra-Code79</a> M Habibi Siregar. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="https://github.com/Kyra-Code79">
            GitHub
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="https://www.linkedin.com/in/habibisiregar79/">
            LinkedIn
          </a>
        </nav>
      </footer>
    </div>
  );
}
