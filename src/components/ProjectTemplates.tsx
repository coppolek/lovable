
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Globe, Smartphone, Palette, Database, ShoppingCart } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  code: string;
  tags: string[];
}

interface ProjectTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  onCancel: () => void;
}

const ProjectTemplates = ({ onSelectTemplate, onCancel }: ProjectTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: Template[] = [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'Homepage moderna con hero section, features e CTA',
      category: 'website',
      icon: <Globe className="w-5 h-5" />,
      tags: ['React', 'Tailwind', 'Responsive'],
      code: `import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Benvenuto nel Futuro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea applicazioni straordinarie con la potenza dell'AI e il design moderno
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              Inizia Ora
            </Button>
            <Button variant="outline" size="lg">
              Scopri di Più
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Funzionalità Principali</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">{i}</span>
                  </div>
                  <h3 className="font-semibold mb-2">Feature {i}</h3>
                  <p className="text-gray-600">Descrizione della funzionalità avanzata</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;`
    },
    {
      id: 'dashboard',
      name: 'Dashboard Admin',
      description: 'Dashboard completa con charts, tabelle e statistiche',
      category: 'admin',
      icon: <Database className="w-5 h-5" />,
      tags: ['Dashboard', 'Charts', 'Tables'],
      code: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Utenti Totali", value: "12,345", change: "+12%" },
            { title: "Vendite", value: "€45,678", change: "+8%" },
            { title: "Ordini", value: "1,234", change: "+15%" },
            { title: "Conversioni", value: "23.4%", change: "+3%" }
          ].map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Badge variant="secondary" className="mt-1">
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafico Vendite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafico Vendite</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attività Recenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Attività {i} completata</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Product',
      description: 'Pagina prodotto e-commerce con carrello e checkout',
      category: 'ecommerce',
      icon: <ShoppingCart className="w-5 h-5" />,
      tags: ['E-commerce', 'Product', 'Shopping'],
      code: `import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";

const EcommerceProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-6xl">👕</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <Badge className="mb-4">Nuovo Arrivo</Badge>
          <h1 className="text-3xl font-bold mb-4">T-Shirt Premium</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(128 recensioni)</span>
          </div>

          <div className="text-3xl font-bold text-purple-600 mb-6">€49.99</div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Taglia</h3>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={\`px-4 py-2 border rounded-lg \${
                    selectedSize === size 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-300'
                  }\`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantità</h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Aggiungi al Carrello
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Descrizione</h3>
              <p className="text-gray-600 text-sm">
                T-shirt premium in cotone 100% biologico. Design moderno e comfort eccezionale.
                Perfetta per ogni occasione, dal casual al semi-formale.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EcommerceProduct;`
    }
  ];

  const categories = [
    { id: 'all', name: 'Tutti' },
    { id: 'website', name: 'Website' },
    { id: 'admin', name: 'Admin' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'mobile', name: 'Mobile' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Template di Progetto</h1>
          <p className="text-gray-600">Inizia velocemente con i nostri template predefiniti</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Annulla
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {template.icon}
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                className="w-full"
                onClick={() => onSelectTemplate(template)}
              >
                Usa Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectTemplates;
