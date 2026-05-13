import { useState, useEffect } from "react";

const S = "https://dnbcvrdsemncglwiexcg.supabase.co";
const K = "sb_publishable_-m4UvMig8RM5UjgbI684fg_D52eXgIX";
const P = "Rico2006!";
const H = {
  "Content-Type": "application/json",
  apikey: K,
  Authorization: "Bearer " + K,
  Prefer: "return=minimal",
};
const PHONE = "2290169163396";
const iC = { nom: "", telephone: "", ville: "", vehicule: "", date: "", message: "" };
const iO = { nom: "", telephone: "", marque: "", modele: "", annee: "", disponibilite: "" };

export default function App() {
  const [v, setV] = useState("form");
  const [t, setT] = useState("client");
  const [cl, setCl] = useState([]);
  const [ow, setOw] = useState([]);
  const [cf, setCf] = useState(iC);
  const [of, setOf] = useState(iO);
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState(null);

  const show = (m, e) => {
    setMsg({ m, e });
    setTimeout(() => setMsg(null), 3000);
  };

  const load = async () => {
    try {
      const [a, b] = await Promise.all([
        fetch(S + "/rest/v1/clients?order=created_at.desc", { headers: H }).then((r) => r.json()),
        fetch(S + "/rest/v1/proprietaires?order=created_at.desc", { headers: H }).then((r) => r.json()),
      ]);
      setCl(a);
      setOw(b);
    } catch (e) {
      show("Erreur connexion", 1);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (text) => {
    window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text), "_blank");
  };

  const addC = async () => {
    if (!cf.nom || !cf.telephone) return show("Nom et telephone requis", 1);
    await fetch(S + "/rest/v1/clients", {
      method: "POST",
      headers: H,
      body: JSON.stringify(cf),
    });
    await load();
    notify("Nouveau client!\n" + cf.nom + "\n" + cf.telephone + "\n" + (cf.ville || "-"));
    setCf(iC);
    show("Lead ajoute!", 0);
  };

  const addO = async () => {
    if (!of.nom || !of.telephone) return show("Nom et telephone requis", 1);
    await fetch(S + "/rest/v1/proprietaires", {
      method: "POST",
      headers: H,
      body: JSON.stringify(of),
    });
    await load();
    notify("Nouveau proprietaire!\n" + of.nom + "\n" + of.telephone + "\n" + of.marque);
    setOf(iO);
    show("Proprietaire ajoute!", 0);
  };

  const delC = async (id) => {
    await fetch(S + "/rest/v1/clients?id=eq." + id, { method: "DELETE", headers: H });
    await load();
  };

  const delO = async (id) => {
    await fetch(S + "/rest/v1/proprietaires?id=eq." + id, { method: "DELETE", headers: H });
    await load();
  };

  const inp = {
    width: "100%",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#080808", minHeight: "100vh", color: "#fff", padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#c8a96e" }}>AutoLead</div>
          <div style={{ fontSize: "11px", color: "#555" }}>COTONOU - GESTION DES LEADS</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setV("form")} style={{ padding: "8px 12px", borderRadius: "8px", background: v === "form" ? "#c8a96e" : "#1a1a1a", color: v === "form" ? "#000" : "#fff", border: "none", cursor: "pointer", fontSize: "13px" }}>
            + Ajouter
          </button>
          <button onClick={() => setV("leads")} style={{ padding: "8px 12px", borderRadius: "8px", background: v === "leads" ? "#c8a96e" : "#1a1a1a", color: v === "leads" ? "#000" : "#fff", border: "none", cursor: "pointer", fontSize: "13px" }}>
            Leads {cl.length + ow.length}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {[
          { l: "Clients", val: cl.length, c: "#c8a96e" },
          { l: "Proprietaires", val: ow.length, c: "#7eb8c8" },
          { l: "Total", val: cl.length + ow.length, c: "#888" },
        ].map((s) => (
          <div key={s.l} style={{ background: "#111", border: "1px solid #222", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: s.c }}>{s.val}</div>
            <div style={{ fontSize: "11px", color: "#555" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {v === "form" && (
        <div>
          <div style={{ display: "flex", background: "#111", borderRadius: "10px", padding: "4px", marginBottom: "16px" }}>
            {[["client", "Client"], ["owner", "Proprietaire"]].map(([k, l]) => (
              <button key={k} onClick={() => setT(k)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", background: t === k ? (k === "client" ? "#c8a96e" : "#7eb8c8") : "transparent", color: t === k ? "#000" : "#555", fontWeight: 600, fontSize: "13px" }}>
                {l}
              </button>
            ))}
          </div>

          {t === "client" ? (
            <div style={{ background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "12px" }}>Nouveau Client</div>
              {[
                ["NOM *", "text", cf.nom, (e) => setCf({ ...cf, nom: e })],
                ["TELEPHONE *", "tel", cf.telephone, (e) => setCf({ ...cf, telephone: e })],
                ["VILLE", "text", cf.ville, (e) => setCf({ ...cf, ville: e })],
                ["DATE", "date", cf.date, (e) => setCf({ ...cf, date: e })],
              ].map(([l, tp, val, fn]) => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>{l}</div>
                  <input type={tp} style={inp} value={val} onChange={(e) => fn(e.target.value)} />
                </div>
              ))}
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>VEHICULE</div>
                <select style={inp} value={cf.vehicule} onChange={(e) => setCf({ ...cf, vehicule: e.target.value })}>
                  <option value="">-- Selectionner --</option>
                  <option>Berline</option>
                  <option>4x4 / SUV</option>
                  <option>Minibus</option>
                  <option>Pick-up</option>
                  <option>Citadine</option>
                </select>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>MESSAGE</div>
                <textarea style={{ ...inp, resize: "vertical" }} rows={3} value={cf.message} onChange={(e) => setCf({ ...cf, message: e.target.value })} />
              </div>
              <button onClick={addC} style={{ width: "100%", padding: "14px", background: "#c8a96e", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                Enregistrer le client
              </button>
            </div>
          ) : (
            <div style={{ background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div style={{ color: "#7eb8c8", fontWeight: 600, marginBottom: "12px" }}>Nouveau Proprietaire</div>
              {[
                ["NOM *", of.nom, (e) => setOf({ ...of, nom: e })],
                ["TELEPHONE *", of.telephone, (e) => setOf({ ...of, telephone: e })],
                ["MARQUE", of.marque, (e) => setOf({ ...of, marque: e })],
                ["MODELE", of.modele, (e) => setOf({ ...of, modele: e })],
                ["ANNEE", of.annee, (e) => setOf({ ...of, annee: e })],
              ].map(([l, val, fn]) => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>{l}</div>
                  <input style={inp} value={val} onChange={(e) => fn(e.target.value)} />
                </div>
              ))}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>DISPONIBILITE</div>
                <select style={inp} value={of.disponibilite} onChange={(e) => setOf({ ...of, disponibilite: e.target.value })}>
                  <option value="">--</option>
                  <option>Toute la semaine</option>
                  <option>Week-end</option>
                  <option>Selon demande</option>
                </select>
              </div>
              <button onClick={addO} style={{ width: "100%", padding: "14px", background: "#7eb8c8", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                Enregistrer le proprietaire
              </button>
            </div>
          )}
        </div>
      )}

      {v === "leads" && (
        !auth ? (
          <div style={{ background: "#111", borderRadius: "14px", padding: "28px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔒</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#c8a96e", marginBottom: "8px" }}>Acces protege</div>
            <div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>Entrez votre mot de passe</div>
            <input type="password" style={{ ...inp, textAlign: "center", letterSpacing: "4px", marginBottom: "10px" }} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (pw === P ? (setAuth(true), setErr(false)) : setErr(true))} />
            {err && <div style={{ color: "#f66", fontSize: "12px", marginBottom: "10px" }}>Mot de passe incorrect</div>}
            <button onClick={() => { if (pw === P) { setAuth(true); setErr(false); } else { setErr(true); } }} style={{ width: "100%", padding: "12px", background: "#c8a96e", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
              Acceder
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
              <span style={{ color: "#555", fontSize: "12px" }}>Connecte</span>
              <button onClick={() => { setAuth(false); setPw(""); }} style={{ background: "none", border: "none", color: "#f66", cursor: "pointer", fontSize: "13px" }}>
                Deconnexion
              </button>
            </div>
            {[
              { title: "Clients", data: cl, del: delC, wa: (c) => "https://wa.me/" + c.telephone + "?text=" + encodeURIComponent("Bonjour " + c.nom + ", suite a votre demande de location...") },
              { title: "Proprietaires", data: ow, del: delO, wa: null },
            ].map((sec) => (
              <div key={sec.title} style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: "#888", fontWeight: 700, letterSpacing: "1px", marginBottom: "10px" }}>{sec.title} ({sec.data.length})</div>
                {sec.data.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#444", fontSize: "13px" }}>Aucun enregistrement</div>
                ) : (
                  sec.data.map((x) => (
                    <div key={x.id} style={{ background: "#111", borderRadius: "10px", padding: "12px", marginBottom: "8px", border: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 600 }}>{x.nom}</div>
                        <button onClick={() => sec.del(x.id)} style={{ background: "none", border: "none", color: "#f66", cursor: "pointer", fontSize: "16px" }}>X</button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {x.telephone && <span style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#25d366" }}>{x.telephone}</span>}
                        {x.ville && <span style={{ background: "#222", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#888" }}>{x.ville}</span>}
                        {x.vehicule && <span style={{ background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#c8a96e" }}>{x.vehicule}</span>}
                        {x.marque && <span style={{ background: "rgba(126,184,200,0.1)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#7eb8c8" }}>{x.marque} {x.modele}</span>}
                        {x.disponibilite && <span style={{ background: "#222", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#888" }}>{x.disponibilite}</span>}
                      </div>
                      {sec.wa && (
                        <a href={sec.wa(x)} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: "8px", padding: "6px 12px", color: "#25d366", fontSize: "12px", textDecoration: "none" }}>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )
      )}

      {msg && (
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", background: msg.e ? "#f66" : "#25d366", color: "#fff", padding: "10px 20px", borderRadius: "20px", fontSize: "14px", fontWeight: 600, zIndex: 999, whiteSpace: "nowrap" }}>
          {msg.m}
        </div>
      )}
    </div>
  );
}
