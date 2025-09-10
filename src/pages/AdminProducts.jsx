import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./AdminProducts.css";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  stock: "",
  categoryId: "",
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [cats, setCats] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [newCat, setNewCat] = useState("");

  async function load() {
    try {
      setLoading(true);
      const [data, categories] = await Promise.all([
        api.listProducts(),
        api.getCategories(),
      ]);
      setItems(data);
      setCats(categories);
    } catch (e) {
      console.error(e);
      setError("❌ No se pudieron cargar productos/categorías");
    } finally {
      setLoading(false);
      setCatLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (error) setError(""); // limpiar error al modificar
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        price: Number(form.price),
        imageUrl: form.imageUrl || null,
        stock: Number(form.stock || 0),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };

      if (!payload.name) {
        throw new Error("El nombre es obligatorio");
      }
      if (Number.isNaN(payload.price)) {
        throw new Error("El precio debe ser un número");
      }

      if (editing) {
        await api.updateProduct(editing, payload);
      } else {
        await api.createProduct(payload);
      }

      setForm(EMPTY);
      setEditing(null);
      await load();
    } catch (e) {
      console.error(e);
      setError(`❌ ${e.message || "No se pudo guardar el producto"}`);
    } finally {
      setSaving(false);
    }
  }

  function onEdit(p) {
    setEditing(p.id);
    setForm({
      name: p.name ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      imageUrl: p.imageUrl ?? "",
      stock: String(p.stock ?? 0),
      categoryId: p.categoryId ? String(p.categoryId) : "",
    });
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.deleteProduct(id);
      await load();
    } catch (e) {
      console.error(e);
      setError("❌ No se pudo eliminar el producto");
    }
  }

  function onCancel() {
    setEditing(null);
    setForm(EMPTY);
  }

  async function addCategory() {
    if (!newCat.trim()) return;
    try {
      const cat = await api.createCategory(newCat.trim());
      setCats((prev) =>
        [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewCat("");
      if (!form.categoryId) {
        setForm((f) => ({ ...f, categoryId: String(cat.id) }));
      }
    } catch (e) {
      console.error(e);
      setError("❌ No se pudo crear la categoría");
    }
  }

  return (
    <div className="admin-wrap">
      <h2 className="admin-title">Admin · Productos</h2>
      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="price"
          placeholder="Precio (número)"
          value={form.price}
          onChange={onChange}
          required
        />
        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={onChange}
        />

        {/* Select de categorías */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          disabled={catLoading}
        >
          <option value="">— Sin categoría —</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="full-row"
          name="imageUrl"
          placeholder="URL de imagen"
          value={form.imageUrl}
          onChange={onChange}
        />
        <textarea
          className="full-row"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={onChange}
        />

        <div className="admin-actions">
          <button
            type="submit"
            className="btn btn-primary btn-create"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : editing
              ? "Guardar cambios"
              : "Crear producto"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Crear categoría inline */}
        <div className="admin-actions">
          <input
            placeholder="Nueva categoría..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <button type="button" className="btn btn-ghost" onClick={addCategory}>
            Añadir categoría
          </button>
        </div>
      </form>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="product-thumb"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name ?? "—"}</td>
                  <td>${p.price}</td>
                  <td>{p.stock ?? 0}</td>
                  <td className="cell-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => onEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: 16, textAlign: "center" }}>
                    Sin productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
