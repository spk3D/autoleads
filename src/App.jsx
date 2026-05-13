import { useState, useEffect } from "react";
const S = "https://dnbcvrdsemncglwiexcg.supabase.co";
const K = "sb_publishable_-m4UvMig8RM5UjgbI684fg_D52eXgIX";
const P = "Rico2006!";
const H = { "Content-Type": "application/json", apikey: K, Authorization: "Bearer " + K, Pref
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
const show = (m, e) => { setMsg({ m, e }); setTimeout(() => setMsg(null), 3000); };
const load = async () => {
try {
const [a, b] = await Promise.all([
fetch(S + "/rest/v1/clients?order=created_at.desc", { headers: H }).then(r => r.json(
fetch(S + "/rest/v1/proprietaires?order=created_at.desc", { headers: H }).then(r => r
]);
setCl(a); setOw(b);
} catch (e) { show("Erreur connexion", 1); }
};
useEffect(() => { load(); }, []);
const notify = (text) => { window.open("https://wa.me/" + PHONE + "?text=" + encodeURICompo
const addC = async () => {
if (!cf.nom || !cf.telephone) return show("Nom et téléphone requis", 1);
await fetch(S + "/rest/v1/clients", { method: "POST", headers: H, body: JSON.stringify(cf
await load();
notify(" Nouveau client!\n " + cf.nom + "\n " + cf.telephone + "\n " + (cf.ville
setCf(iC); show(" Lead ajouté!", 0);
};
const addO = async () => {
if (!of.nom || !of.telephone) return show("Nom et téléphone requis", 1);
await fetch(S + "/rest/v1/proprietaires", { method: "POST", headers: H, body: JSON.string
await load();
notify(" Nouveau propriétaire!\n " + of.nom + "\n " + of.telephone + "\n " + of.
setOf(iO); show(" Propriétaire ajouté!", 0);
};
const delC = async (id) => { await fetch(S + "/rest/v1/clients?id=eq." + id, { method: "DEL
const delO = async (id) => { await fetch(S + "/rest/v1/proprietaires?id=eq." + id, { method
const inp = { width: "100%", background: "#111", border: "1px solid #333", borderRadius: "8
return (
<div style={{ fontFamily: "sans-serif", background: "#080808", minHeight: "100vh", color:
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", m
<div>
<div style={{ fontSize: "20px", fontWeight: 700, color: "#c8a96e" }}>AutoLead</div>
<div style={{ fontSize: "11px", color: "#555" }}>COTONOU · GESTION DES LEADS</div>
</div>
<div style={{ display: "flex", gap: "8px" }}>
<button onClick={() => setV("form")} style={{ padding: "8px 12px", borderRadius: "8
<button onClick={() => setV("leads")} style={{ padding: "8px 12px", borderRadius: "
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginB
{[{ l: "Clients", val: cl.length, c: "#c8a96e" }, { l: "Propriétaires", val: ow.lengt
<div key={s.l} style={{ background: "#111", border: "1px solid #222", borderRadius:
<div style={{ fontSize: "24px", fontWeight: 700, color: s.c }}>{s.val}</div>
<div style={{ fontSize: "11px", color: "#555" }}>{s.l}</div>
</div>
))}
</div>
{v === "form" && (
<div>
<div style={{ display: "flex", background: "#111", borderRadius: "10px", padding: "
{[["client", " Client"], ["owner", " Propriétaire"]].map(([k, l]) => (
<button key={k} onClick={() => setT(k)} style={{ flex: 1, padding: "10px", bord
))}
</div>
{t === "client" ? (
<div style={{ background: "#111", borderRadius: "12px", padding: "16px" }}>
<div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "12px" }}> {[["Nom *", "text", cf.nom, e => setCf({ ...cf, nom: e })], ["Téléphone *", "te
<div key={l} style={{ marginBottom: "10px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>{l}</div>
Nou
<input type={tp} style={inp} value={val} onChange={e => fn(e.target.value)}
</div>
))}
<div style={{ marginBottom: "10px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>VÉHICULE</d
<select style={inp} value={cf.vehicule} onChange={e => setCf({ ...cf, vehicul
<option value="">-- Sélectionner --</option>
<option>Berline</option><option>4x4 / SUV</option><option>Minibus</option><
</select>
</div>
<div style={{ marginBottom: "10px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>MESSAGE</di
<textarea style={{ ...inp, resize: "vertical" }} rows={3} value={cf.message}
</div>
<button onClick={addC} style={{ width: "100%", padding: "14px", background: "#c
</div>
) : (
<div style={{ background: "#111", borderRadius: "12px", padding: "16px" }}>
<div style={{ color: "#7eb8c8", fontWeight: 600, marginBottom: "12px" }}> Nou
{[["Nom *", of.nom, e => setOf({ ...of, nom: e })], ["Téléphone *", of.telephon
<div key={l} style={{ marginBottom: "10px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>{l}</div>
<input style={inp} value={val} onChange={e => fn(e.target.value)} />
</div>
))}
<div style={{ marginBottom: "10px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>DISPONIBILI
<select style={inp} value={of.disponibilite} onChange={e => setOf({ ...of, di
<option value="">--</option>
<option>Toute la semaine</option><option>Week-end</option><option>Selon dem
</select>
</div>
<button onClick={addO} style={{ width: "100%", padding: "14px", background: "#7
</div>
)}
</div>
)}
{v === "leads" && (!auth ? (
<div style={{ background: "#111", borderRadius: "14px", padding: "28px", textAlign: "
<div style={{ fontSize: "36px", marginBottom: "12px" }}> </div>
<div style={{ fontSize: "16px", fontWeight: 700, color: "#c8a96e", marginBottom: "8
<div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>Entrez votre
<input type="password" style={{ ...inp, textAlign: "center", letterSpacing: "4px",
{err && <div style={{ color: "#f66", fontSize: "12px", marginBottom: "10px" }}>Mot
<button onClick={() => { if (pw === P) { setAuth(true); setErr(false); } else { set
</div>
) : (
<div>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px
<span style={{ color: "#555", fontSize: "12px" }}> Connecté</span>
<button onClick={() => { setAuth(false); setPw(""); }} style={{ background: "none
</div>
{[
Clients", data: cl, del: delC, wa: (c) => "https://wa.me/?text=" + e
Propriétaires", data: ow, del: delO, wa: null }
{ title: " { title: " ].map(sec => (
<div key={sec.title} style={{ marginBottom: "20px" }}>
<div style={{ fontSize: "11px", color: "#888", fontWeight: 700, letterSpacing:
{sec.data.length === 0 ? (
<div style={{ textAlign: "center", padding: "20px", color: "#444", fontSize:
) : sec.data.map(x => (
<div key={x.id} style={{ background: "#111", borderRadius: "10px", padding: "
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ fontWeight: 600 }}>{x.nom}</div>
<button onClick={() => sec.del(x.id)} style={{ background: "none", </div>
<div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8p
{x.telephone && <span style={{ background: "rgba(37,211,102,0.1)", border
{x.ville && <span style={{ background: "#222", borderRadius: "6px", paddi
{x.vehicule && <span style={{ background: "rgba(200,169,110,0.1)", border
{x.marque && <span style={{ background: "rgba(126,184,200,0.1)", borderRa
{x.disponibilite && <span style={{ background: "#222", borderRadius: "6px
</div>
{sec.wa && <a href={sec.wa(x)} target="_blank" rel="noreferrer" style={{ di
</div>
border
))}
</div>
))}
</div>
))}
{msg && <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "trans
</div>
);
}
