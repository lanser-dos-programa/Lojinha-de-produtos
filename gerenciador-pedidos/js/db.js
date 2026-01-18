let db;

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("lojaDB", 1);

        request.onupgradeneeded = e => {
            const db = e.target.result;
            db.createObjectStore("produtos", {
                keyPath: "id",
                autoIncrement: true
            });
        };

        request.onsuccess = e => {
            db = e.target.result;
            resolve();
        };

        request.onerror = () => reject("Erro no IndexedDB");
    });
}

export function addProduto(produto) {
    const tx = db.transaction("produtos", "readwrite");
    tx.objectStore("produtos").add(produto);
}

export function getProdutos(callback) {
    const tx = db.transaction("produtos", "readonly");
    const store = tx.objectStore("produtos");
    store.getAll().onsuccess = e => callback(e.target.result);
}

export function updateProduto(produto) {
    const tx = db.transaction("produtos", "readwrite");
    tx.objectStore("produtos").put(produto);
}

export function deleteProduto(id) {
    const tx = db.transaction("produtos", "readwrite");
    tx.objectStore("produtos").delete(id);
}
