import { useEffect, useState } from "react";
import api from "../api/axios";

interface Asset {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Repair" | "Retired";
  assignedTo?: string;
  purchaseDate: string;
  serialNumber: string;
  userId?: number | null;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting
  const [sortField, setSortField] = useState<keyof Asset>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Search + Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Create asset
  const [showCreate, setShowCreate] = useState(false);

  // Edit asset
  const [showEdit, setShowEdit] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // View asset
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [viewAsset, setViewAsset] = useState<Asset | null>(null);

  useEffect(() => {
    api
      .get("/assets")
      .then((res) => setAssets(res.data))
      .finally(() => setLoading(false));
  }, []);

  // SORTING
  const sortedAssets = [...assets].sort((a, b) => {
    const valA = String(a[sortField] ?? "");
    const valB = String(b[sortField] ?? "");

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // FILTERING
  const filteredAssets = sortedAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || asset.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || asset.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // PAGINATION
  const paginatedAssets = filteredAssets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredAssets.length / pageSize);

  const statusStyles: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Repair: "bg-yellow-100 text-yellow-700",
    Retired: "bg-gray-100 text-gray-700",
  };

  return (
    <>
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold mb-6">Assets</h1>

        <button onClick={() => setShowCreate(true)}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Asset</button>
    </div>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Active</option>
          <option>Repair</option>
          <option>Retired</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Laptop</option>
          <option>Desktop</option>
          <option>Monitor</option>
          <option>Phone</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden p-6">
        {/* Loading State */}
        {loading && (
          <div className="p-6 text-gray-500">Loading assets…</div>
        )}

        {/* Empty State */}
        {!loading && filteredAssets.length === 0 && (
          <div className="p-6 text-gray-500">No assets found.</div>
        )}

        {/* Table */}
        {!loading && filteredAssets.length > 0 && (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 px-4">Asset ID</th>

                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>

                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category
                </th>

                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>

                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("assignedTo")}
                >
                  Assigned
                </th>

                <th
                  className="py-3 px-4 cursor-pointer"
                  onClick={() => handleSort("purchaseDate")}
                >
                  Purchase Date
                </th>

                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{asset.id}</td>
                  <td className="py-3 px-4">{asset.name}</td>
                  <td className="py-3 px-4">{asset.category}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${statusStyles[asset.status]}`}
                    >
                      {asset.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {asset.assignedTo ?? "—"}
                  </td>

                  <td className="py-3 px-4">
                    {new Date(asset.purchaseDate).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:underline mr-3"
                    onClick={() => {
                        setViewAsset(asset);
                        setShowViewPanel(true);
                    }}>
                      View
                    </button>
                    <button className="text-gray-600 hover:underline"
                    onClick={() => {
                        setSelectedAsset(asset);
                        setShowEdit(true);
                    }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && filteredAssets.length > 0 && (
          <div className="flex justify-between items-center p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* CREATE ASSET */}
      {showCreate && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Create Asset</h2>

      <form
        onSubmit={async (e) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement & {
    name: { value: string };
    category: { value: string };
    status: { value: string };
    assignedTo: { value: string };
    purchaseDate: { value: string };
    serialNumber: { value: string };
    userId?: { value: string };
  };

  const newAsset = {
    name: form.name.value,
    category: form.category.value,
    status: form.status.value,
    assignedTo: form.assignedTo.value,
    purchaseDate: form.purchaseDate.value,
    serialNumber: form.serialNumber.value,
    userId: form.userId?.value,
  };

  try {
    const res = await api.post("/assets", newAsset);
    setAssets((prev) => [...prev, res.data]);
    setShowCreate(false);
  } catch (err) {
    console.error("Failed to create asset", err);
  }
}}

      >
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            required
            className="border p-2 rounded w-full"
            placeholder="Dell Latitude 5520"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            required
            className="border p-2 rounded w-full"
            placeholder="Laptop"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Assigned To</label>
          <input
            name="assignedTo"
            className="border p-2 rounded w-full"
            placeholder="John Doe"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Purchase Date</label>
          <input
            name="purchaseDate"
            type="date"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            className="border p-2 rounded w-full"
            required
          >
            <option>Active</option>
            <option>Repair</option>
            <option>Retired</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Serial Number</label>
          <input
            name="serialNumber"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            name="userId"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Edit Asset */}
{showEdit && selectedAsset && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
            <form
                onSubmit={async (e) => {
                e.preventDefault();
                
                const form = e.target as HTMLFormElement & {
                    name: { value: string };
                    category: { value: string };
                    status: { value: string };
                    purchaseDate: { value: string };
                    serialNumber: { value: string };
                    userId: { value: string };
                };
                
                const updatedAsset = {
                    name: form.name.value,
                    category: form.category.value,
                    status: form.status.value,
                    purchaseDate: form.purchaseDate.value,
                    serialNumber: form.serialNumber.value,
                    userId: form.userId.value,
                };
                
                try {
                    const res = await api.put(`/assets/${selectedAsset.id}`, updatedAsset);
                    
                    // Update the table instantly
                    setAssets((prev) =>
                        prev.map((a) => (a.id === selectedAsset.id ? res.data : a))
                );
                setShowEdit(false);
                setSelectedAsset(null);
                } catch (err) {
                    console.error("Failed to update asset", err);
                }
            }}
            >
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name"
                    defaultValue={selectedAsset.name}
                    required
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input name="category"
                    defaultValue={selectedAsset.category}
                    required
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Assigned To</label>
                    <input name="assignedTo"
                    defaultValue={selectedAsset.assignedTo ?? ""}
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Purchase Date</label>
                    <input name="purchaseDate"
                    defaultValue={selectedAsset.purchaseDate.split("T")[0]}
                    required
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-mdeium mb-1">Status</label>
                    <select name="status"
                    defaultValue={selectedAsset.status}
                    className="border p-2 rounded w-full"
                    required>
                        <option>Active</option>
                        <option>Repair</option>
                        <option>Retired</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Serial Number</label>
                    <input name="serialNumber"
                    defaultValue={selectedAsset.serialNumber}
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">User ID</label>
                    <input name="userId"
                    defaultValue={selectedAsset.userId ?? ""}
                    className="border p-2 rounded w-full"/>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button"
                    onClick={() => {
                        setShowEdit(false);
                        setSelectedAsset(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded">
                        Cancel
                    </button>

                    <button type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

{/* View Asset */}
{showViewPanel && viewAsset && (
    <div className="fixed inset-0 flex justify-end bg-black bg-opacity-40 z-50">
        <div className="w-96 bg-white h-full shadow-xl p-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Asset Details</h2>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Asset ID</p>
                    <p className="font-medium">{viewAsset.id}</p>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{viewAsset.name}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{viewAsset.category}</p>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{viewAsset.status}</p>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium">{viewAsset.assignedTo ?? "-"}</p>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Purcahse Date</p>
                    <p className="font-medium">{new Date(viewAsset.purchaseDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{viewAsset.serialNumber}</p>
                </div>

                <div className="mt8 flex justify-end">
                    <button onClick={() => {
                        setShowViewPanel(false);
                        setViewAsset(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    </div>
)}
</>
  );
}