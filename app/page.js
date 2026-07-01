import AddProductForm from "@/components/AddProductForm";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/server";
import {Rabbit , Shield , Bell, TrendingDown} from "lucide-react"
import { getProducts } from "./action";
import ProductCard from "@/components/ProductCard";


export default  async function Home() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const Products = user ? await getProducts() : []
  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className = " min-h-screen bg-[f8f8f8]">
      <header className = "bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 ">
        <Navbar user ={user} />
      </header>

    {/* hero section */}
      <section className = "py-20 px-4" >
        <div className ="max-w-7xl mx-auto text-center">

          <div>

          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight text-center">
            Never Miss a Price Drop
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices from any e-commerce site. Get instant alerts when
            prices drop. Save money effortlessly.
          </p>


          {/* Add product Form  */}

            <AddProductForm  user ={user}/>


        {user && Products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center mt-12 ">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}

        {user && Products.length > 0 && 
        <section className = " max-w-7xl mx-auto px-4 pb-20">

          <div className= " flex items-center justify-between mb-6">
            <h3>
              Your Tracked Products
            </h3>

            <span className= " text-sm text-gray-500">

              {Products.length } {Products.length  == 1 ? "Product"  : "Products"}

            </span>


          </div>

          <div className = " grid md:grid-col-2 gap-6 items-start">
            {
            Products.map((product) => (
              <ProductCard  key = {product.id} product = {product}/>
            ))

            
            }

          </div>
          
        </section>}

          {/* Features */}


          {Products.length === 0 &&  
          <div className = " grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
          </div>
          
          }
           
        </div>


      </section>

    </main>
  );
}
