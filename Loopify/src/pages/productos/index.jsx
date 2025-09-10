import { useEffect, useState } from "react";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:4000/api/products"); // 👈 ajusta al endpoint de tu backend
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="border rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
          )}
          <h2 className="text-lg font-bold">{p.name}</h2>
          <p className="text-gray-600">{p.description}</p>
          <p className="text-sm mt-1 font-semibold">💲{p.price}</p>
          <p className="text-sm">Stock: {p.stock}</p>
          {p.category && (
            <p className="text-sm text-blue-600 mt-1">
              Categoría: {p.category.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
