import { useState, useEffect } from "react";

const S = "https://dnbcvrdsemncglwiexcg.supabase.co";
const K = "sb_publishable_-m4UvMig8RM5UjgbI684fg_D52eXgIX";
const ADMIN_PWD = "Rico2006!";
const WHATSAPP_ADMIN = "2290169163396";

const H = {
  "Content-Type": "application/json",
  apikey: K,
  Authorization: "Bearer " + K,
  Prefer: "return=representation",
};

const VEHICLE_TYPES = ["Tous", "Berline", "4x4 / SUV", "Minibus", "Pick-up", "Citadine", "Utilitaire", "Moto"];
const QUARTIERS = ["Akpakpa","Cadjehoun","Fidjrosse","Gbegamey","Haie Vive","Jericho","Kouhounou","Ladji","Menontin","Missebo","PK3","PK6","PK10","Sainte Rita","Tokpa","Vossa","Zogbo","Autre"];

const inp = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "14px 16px",
  color: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const lbl = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1px",
  color: "#888",
  marginBottom: "6px",
  display: "block",
};

const iV = { nom:"", telephone:"", email:"", quartier:"", type_vehicule:"", marque:"", modele:"", annee:"", couleur:"", prix_heure:"", prix_jour:"", description:"", disponibilite:"Toute la semaine" };

// ─── COMPOSANTS ───────────────────────────────────────────────

function Logo({ size = 24 }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
      <span style={{ fontSize: size, fontWeight: 900, color: "#f5c842", letterSpacing: "-1px" }}>D</span>
      <span style={{ fontSize: size * 0.85, fontWeight: 700, color: "#fff" }}>Loca</span>
    </div>
  );
}

function Badge({ children, color = "#f5c842" }) {
  return (
    <span style={{
      background: `${color}22`,
      border: `1px solid ${color}44`,
      borderRadius: "6px",
      padding: "3px 8px",
      fontSize: "11px",
      color,
      fontWeight: 600,
    }}>{children}</span>
  );
}

// ─── PAGE CLIENT ──────────────────────────────────────────────

function PageClient({ onRegister }) {
  const [vehicules, setVehicules] = useState([]);
  const [filtre, setFiltre] = useState("Tous");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${S}/rest/v1/proprietaires_dloca?abonnement_actif=eq.true&statut=eq.valide&select=*`, { headers: H })
      .then(r => r.json())
      .then(d => { setVehicules(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = vehicules.filter(v => {
    const matchType = filtre === "Tous" || v.type_vehicule === filtre;
    const matchSearch = !search || 
      v.marque?.toLowerCase().includes(search.toLowerCase()) ||
      v.modele?.toLowerCase().includes(search.toLowerCase()) ||
      v.quartier?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Trebuchet MS', sans-serif" }}>
      
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #111 0%, #0a0a0a 60%)",
        borderBottom: "1px solid rgba(245,200,66,0.15)",
        padding: "28px 20px 24px",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <Logo size={26} />
              <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginTop: "2px" }}>COTONOU · LOCATION AUTO</div>
            </div>
            <button
              onClick={onRegister}
              style={{
                padding: "8px 14px",
                background: "rgba(245,200,66,0.1)",
                border: "1px solid rgba(245,200,66,0.3)",
                borderRadius: "10px",
                color: "#f5c842",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Mon vehicule
            </button>
          </div>

          <div style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1.2, marginBottom: "6px" }}>
            Trouve ton vehicule<br />
            <span style={{ color: "#f5c842" }}>a Cotonou</span>
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>
            {vehicules.length} vehicule{vehicules.length > 1 ? "s" : ""} disponible{vehicules.length > 1 ? "s" : ""}
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
            <input
              placeholder="Marque, modele, quartier..."
              style={{ ...inp, paddingLeft: "42px" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filtres type */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {VEHICLE_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFiltre(t)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: filtre === t ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: filtre === t ? "#f5c842" : "rgba(255,255,255,0.04)",
                  color: filtre === t ? "#000" : "#888",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste vehicules */}
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🚗</div>
            Chargement...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>Aucun vehicule trouve</div>
            <div style={{ fontSize: "13px" }}>Essaie un autre filtre</div>
          </div>
        ) : (
          filtered.map(v => (
            <CarteVehicule key={v.id} v={v} />
          ))
        )}
      </div>
    </div>
  );
}

function CarteVehicule({ v }) {
  const [expanded, setExpanded] = useState(false);
  const photos = Array.isArray(v.photos) ? v.photos : [];

  const wa = () => {
    const txt = `Bonjour, je suis interesse par votre ${v.marque} ${v.modele} sur DLoca. Est-il disponible ?`;
    window.open(`https://wa.me/${v.telephone}?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <div style={{
      background: "#111",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "18px",
      marginBottom: "16px",
      overflow: "hidden",
    }}>
      {/* Photo */}
      {photos.length > 0 ? (
        <div style={{ position: "relative", height: "200px", background: "#1a1a1a" }}>
          <img
            src={photos[0]}
            alt={v.marque}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {photos.length > 1 && (
            <div style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "11px",
              color: "#fff",
            }}>
              +{photos.length - 1} photos
            </div>
          )}
          <div style={{
            position: "absolute",
            top: "10px",
            left: "10px",
          }}>
            <Badge>{v.type_vehicule}</Badge>
          </div>
        </div>
      ) : (
        <div style={{
          height: "140px",
          background: "linear-gradient(135deg, #1a1a1a, #111)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}>
          🚗
        </div>
      )}

      <div style={{ padding: "16px" }}>
        {/* Titre */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "17px" }}>{v.marque} {v.modele}</div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>
              📍 {v.quartier} {v.annee && `· ${v.annee}`} {v.couleur && `· ${v.couleur}`}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#f5c842" }}>
              {Number(v.prix_jour).toLocaleString()} F
            </div>
            <div style={{ fontSize: "10px", color: "#555" }}>/ jour</div>
          </div>
        </div>

        {/* Prix heure */}
        {v.prix_heure && (
          <div style={{ marginBottom: "10px" }}>
            <Badge color="#7eb8c8">{Number(v.prix_heure).toLocaleString()} FCFA / heure</Badge>
          </div>
        )}

        {/* Dispo */}
        <div style={{ marginBottom: "12px" }}>
          <Badge color="#25d366">✓ {v.disponibilite}</Badge>
        </div>

        {/* Description */}
        {v.description && (
          <div style={{ fontSize: "13px", color: "#666", marginBottom: "14px", lineHeight: 1.5 }}>
            {expanded ? v.description : v.description.slice(0, 80) + (v.description.length > 80 ? "..." : "")}
            {v.description.length > 80 && (
              <span
                onClick={() => setExpanded(!expanded)}
                style={{ color: "#f5c842", cursor: "pointer", marginLeft: "4px" }}
              >
                {expanded ? "Moins" : "Plus"}
              </span>
            )}
          </div>
        )}

        {/* Bouton WhatsApp */}
        <button
          onClick={wa}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #25d366, #1da851)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: 800,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span>💬</span> Contacter le proprietaire
        </button>
      </div>
    </div>
  );
}

// ─── PAGE INSCRIPTION PROPRIO ─────────────────────────────────

function PageProprio({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState(iV);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const uploadPhotos = async (id) => {
    const urls = [];
    for (const file of photos) {
      const ext = file.name.split(".").pop();
      const path = `vehicules/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const res = await fetch(`${S}/storage/v1/object/dloca-photos/${path}`, {
        method: "POST",
        headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": file.type, "x-upsert": "true" },
        body: file,
      });
      if (res.ok) urls.push(`${S}/storage/v1/object/public/dloca-photos/${path}`);
    }
    return urls;
  };

  const submit = async () => {
    if (!form.nom || !form.telephone || !form.quartier || !form.type_vehicule || !form.marque || !form.modele || !form.prix_jour) {
      setError("Remplis tous les champs obligatoires (*).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${S}/rest/v1/proprietaires_dloca`, {
        method: "POST",
        headers: H,
        body: JSON.stringify({ ...form, prix_heure: form.prix_heure || null, annee: form.annee || null, statut: "en_attente", abonnement_actif: false }),
      });
      const data = await res.json();
      const id = data[0]?.id;
      if (id && photos.length > 0) {
        const photoUrls = await uploadPhotos(id);
        await fetch(`${S}/rest/v1/proprietaires_dloca?id=eq.${id}`, {
          method: "PATCH",
          headers: H,
          body: JSON.stringify({ photos: photoUrls }),
        });
      }
      // Notifier admin
      const txt = `Nouvelle inscription DLoca!\n${form.nom}\n${form.telephone}\n${form.marque} ${form.modele} - ${form.quartier}`;
      window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(txt)}`, "_blank");
      setDone(true);
    } catch (e) {
      setError("Erreur lors de l inscription. Reessaie.");
    }
    setLoading(false);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Trebuchet MS', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#f5c842", marginBottom: "10px" }}>Dossier envoye!</div>
        <div style={{ color: "#666", fontSize: "14px", lineHeight: 1.6, marginBottom: "28px" }}>
          Tu recevras un message WhatsApp sous 24h pour confirmer ton abonnement et activer ta fiche.
        </div>
        <div style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: "14px", padding: "18px", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#f5c842", fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>ABONNEMENT MENSUEL</div>
          <div style={{ fontSize: "28px", fontWeight: 800 }}>10 000 FCFA</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>paiement Mobile Money apres validation</div>
        </div>
        <button onClick={onBack} style={{ width: "100%", padding: "14px", background: "#f5c842", color: "#000", border: "none", borderRadius: "12px", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}>
          Retour a l accueil
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Trebuchet MS', sans-serif" }}>
      <div style={{ borderBottom: "1px solid rgba(245,200,66,0.15)", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: "20px", cursor: "pointer" }}>←</button>
        <div>
          <Logo size={22} />
          <div style={{ fontSize: "10px", color: "#444", letterSpacing: "1px" }}>INSCRIPTION PROPRIETAIRE</div>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 800, marginBottom: "6px" }}>Inscrire mon vehicule</div>
        <div style={{ fontSize: "13px", color: "#555", marginBottom: "24px" }}>Abonnement 10 000 FCFA/mois · Activation sous 24h</div>

        {/* Steps */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: "3px", borderRadius: "2px", background: s <= step ? "#f5c842" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "12px", color: "#f5c842", fontWeight: 700, letterSpacing: "1px", marginBottom: "18px" }}>01 — TES INFORMATIONS</div>
            {[["NOM COMPLET *","text","nom","Ex: Jean Koffi"],["TELEPHONE WHATSAPP *","tel","telephone","Ex: 0197000000"],["EMAIL","email","email","Ex: jean@gmail.com"]].map(([l,tp,k,ph]) => (
              <div key={k} style={{ marginBottom: "14px" }}>
                <span style={lbl}>{l}</span>
                <input type={tp} placeholder={ph} style={inp} value={form[k]} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
            <div style={{ marginBottom: "14px" }}>
              <span style={lbl}>QUARTIER *</span>
              <select style={inp} value={form.quartier} onChange={e => set("quartier", e.target.value)}>
                <option value="">-- Selectionner --</option>
                {QUARTIERS.map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
            {error && <div style={{ color: "#f66", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
            <button onClick={() => { if (!form.nom||!form.telephone||!form.quartier){setError("Champs obligatoires manquants.");return;} setError(null);setStep(2); }} style={{ width:"100%",padding:"15px",background:"#f5c842",color:"#000",border:"none",borderRadius:"12px",fontWeight:800,fontSize:"15px",cursor:"pointer" }}>
              Continuer →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "12px", color: "#f5c842", fontWeight: 700, letterSpacing: "1px", marginBottom: "18px" }}>02 — TON VEHICULE</div>
            <div style={{ marginBottom: "14px" }}>
              <span style={lbl}>TYPE *</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {VEHICLE_TYPES.filter(t => t !== "Tous").map(t => (
                  <button key={t} onClick={() => set("type_vehicule", t)} style={{ padding:"11px",border:form.type_vehicule===t?"2px solid #f5c842":"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",background:form.type_vehicule===t?"rgba(245,200,66,0.12)":"rgba(255,255,255,0.03)",color:form.type_vehicule===t?"#f5c842":"#777",fontSize:"13px",fontWeight:600,cursor:"pointer" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {[["MARQUE *","text","marque","Ex: Toyota"],["MODELE *","text","modele","Ex: Camry"],["ANNEE","number","annee","Ex: 2019"],["COULEUR","text","couleur","Ex: Blanc"]].map(([l,tp,k,ph]) => (
              <div key={k} style={{ marginBottom: "14px" }}>
                <span style={lbl}>{l}</span>
                <input type={tp} placeholder={ph} style={inp} value={form[k]} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px" }}>
              <div>
                <span style={lbl}>PRIX / HEURE (FCFA)</span>
                <input type="number" placeholder="Ex: 5000" style={inp} value={form.prix_heure} onChange={e => set("prix_heure", e.target.value)} />
              </div>
              <div>
                <span style={lbl}>PRIX / JOUR (FCFA) *</span>
                <input type="number" placeholder="Ex: 25000" style={inp} value={form.prix_jour} onChange={e => set("prix_jour", e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom:"14px" }}>
              <span style={lbl}>DISPONIBILITE</span>
              <select style={inp} value={form.disponibilite} onChange={e => set("disponibilite", e.target.value)}>
                <option>Toute la semaine</option>
                <option>Week-end uniquement</option>
                <option>Selon demande</option>
              </select>
            </div>
            <div style={{ marginBottom:"20px" }}>
              <span style={lbl}>DESCRIPTION</span>
              <textarea placeholder="Climatise, GPS, bon etat..." style={{ ...inp,resize:"vertical",minHeight:"70px" }} value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            {error && <div style={{ color:"#f66",fontSize:"13px",marginBottom:"12px" }}>{error}</div>}
            <div style={{ display:"flex",gap:"10px" }}>
              <button onClick={() => setStep(1)} style={{ flex:1,padding:"15px",background:"rgba(255,255,255,0.04)",color:"#777",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",fontWeight:700,fontSize:"14px",cursor:"pointer" }}>← Retour</button>
              <button onClick={() => { if(!form.type_vehicule||!form.marque||!form.modele||!form.prix_jour){setError("Champs obligatoires manquants.");return;} setError(null);setStep(3); }} style={{ flex:2,padding:"15px",background:"#f5c842",color:"#000",border:"none",borderRadius:"12px",fontWeight:800,fontSize:"15px",cursor:"pointer" }}>Continuer →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: "12px", color: "#f5c842", fontWeight: 700, letterSpacing: "1px", marginBottom: "18px" }}>03 — PHOTOS</div>
            <label style={{ display:"block",border:"2px dashed rgba(245,200,66,0.25)",borderRadius:"14px",padding:"28px",textAlign:"center",cursor:"pointer",background:"rgba(245,200,66,0.02)",marginBottom:"16px" }}>
              <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handlePhotos} />
              <div style={{ fontSize:"36px",marginBottom:"10px" }}>📷</div>
              <div style={{ color:"#f5c842",fontWeight:700,marginBottom:"4px" }}>Ajouter des photos</div>
              <div style={{ color:"#444",fontSize:"12px" }}>Plusieurs photos acceptees</div>
            </label>
            {previews.length > 0 && (
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:"16px" }}>
                {previews.map((url,i) => (
                  <div key={i} style={{ aspectRatio:"1",borderRadius:"10px",overflow:"hidden",border:"1px solid rgba(245,200,66,0.2)" }}>
                    <img src={url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  </div>
                ))}
              </div>
            )}
            {/* Recap */}
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"12px",padding:"14px",marginBottom:"16px" }}>
              <div style={{ fontSize:"10px",color:"#444",fontWeight:700,letterSpacing:"1px",marginBottom:"10px" }}>RECAPITULATIF</div>
              {[["Nom",form.nom],["Tel",form.telephone],["Quartier",form.quartier],["Vehicule",`${form.marque} ${form.modele}`],["Type",form.type_vehicule],["Prix/jour",form.prix_jour?form.prix_jour+" FCFA":"-"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:"6px" }}>
                  <span style={{ color:"#555",fontSize:"13px" }}>{k}</span>
                  <span style={{ color:"#fff",fontSize:"13px",fontWeight:600 }}>{v||"-"}</span>
                </div>
              ))}
            </div>
            {error && <div style={{ color:"#f66",fontSize:"13px",marginBottom:"12px",textAlign:"center" }}>{error}</div>}
            <div style={{ display:"flex",gap:"10px" }}>
              <button onClick={() => setStep(2)} style={{ flex:1,padding:"15px",background:"rgba(255,255,255,0.04)",color:"#777",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",fontWeight:700,cursor:"pointer" }}>← Retour</button>
              <button onClick={submit} disabled={loading} style={{ flex:2,padding:"15px",background:loading?"#333":"#f5c842",color:loading?"#666":"#000",border:"none",borderRadius:"12px",fontWeight:800,fontSize:"15px",cursor:loading?"not-allowed":"pointer" }}>
                {loading ? "Envoi..." : "Soumettre mon dossier"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE ADMIN ───────────────────────────────────────────────

function PageAdmin({ onBack }) {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("en_attente");

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${S}/rest/v1/proprietaires_dloca?order=created_at.desc&select=*`, { headers: H });
    const d = await res.json();
    setData(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => { if (auth) load(); }, [auth]);

  const activer = async (id) => {
    await fetch(`${S}/rest/v1/proprietaires_dloca?id=eq.${id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ statut: "valide", abonnement_actif: true }),
    });
    load();
  };

  const desactiver = async (id) => {
    await fetch(`${S}/rest/v1/proprietaires_dloca?id=eq.${id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ statut: "en_attente", abonnement_actif: false }),
    });
    load();
  };

  const supprimer = async (id) => {
    await fetch(`${S}/rest/v1/proprietaires_dloca?id=eq.${id}`, { method: "DELETE", headers: H });
    load();
  };

  if (!auth) return (
    <div style={{ minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'Trebuchet MS', sans-serif" }}>
      <div style={{ width:"100%",maxWidth:"340px",textAlign:"center" }}>
        <Logo size={28} />
        <div style={{ fontSize:"32px",margin:"24px 0 8px" }}>🔒</div>
        <div style={{ fontSize:"16px",fontWeight:700,color:"#f5c842",marginBottom:"6px" }}>Espace Admin</div>
        <div style={{ fontSize:"13px",color:"#444",marginBottom:"24px" }}>Acces reserve</div>
        <input type="password" style={{ ...inp,textAlign:"center",letterSpacing:"4px",marginBottom:"10px" }} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter"&&(pw===ADMIN_PWD?(setAuth(true),setErr(false)):setErr(true))} />
        {err && <div style={{ color:"#f66",fontSize:"12px",marginBottom:"10px" }}>Mot de passe incorrect</div>}
        <button onClick={() => pw===ADMIN_PWD?(setAuth(true),setErr(false)):setErr(true)} style={{ width:"100%",padding:"14px",background:"#f5c842",color:"#000",border:"none",borderRadius:"12px",fontWeight:800,fontSize:"15px",cursor:"pointer",marginBottom:"14px" }}>Acceder</button>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"13px" }}>← Retour</button>
      </div>
    </div>
  );

  const filtered = data.filter(d => d.statut === tab || (tab === "valide" && d.abonnement_actif));
  const enAttente = data.filter(d => d.statut === "en_attente").length;

  return (
    <div style={{ minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"'Trebuchet MS', sans-serif" }}>
      <div style={{ borderBottom:"1px solid rgba(245,200,66,0.15)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <Logo size={20} />
          <div style={{ fontSize:"10px",color:"#444",letterSpacing:"1px" }}>ADMIN</div>
        </div>
        <div style={{ display:"flex",gap:"8px" }}>
          <button onClick={onBack} style={{ background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"#666",padding:"6px 12px",cursor:"pointer",fontSize:"12px" }}>← Accueil</button>
          <button onClick={() => { setAuth(false); setPw(""); }} style={{ background:"none",border:"none",color:"#f66",cursor:"pointer",fontSize:"12px" }}>Deconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth:"480px",margin:"0 auto",padding:"20px 16px" }}>
        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"20px" }}>
          {[
            { l:"Total",val:data.length,c:"#888" },
            { l:"En attente",val:enAttente,c:"#f5c842" },
            { l:"Actifs",val:data.filter(d=>d.abonnement_actif).length,c:"#25d366" },
          ].map(s => (
            <div key={s.l} style={{ background:"#111",border:"1px solid #1a1a1a",borderRadius:"10px",padding:"12px",textAlign:"center" }}>
              <div style={{ fontSize:"22px",fontWeight:800,color:s.c }}>{s.val}</div>
              <div style={{ fontSize:"11px",color:"#444" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",background:"#111",borderRadius:"10px",padding:"4px",marginBottom:"16px" }}>
          {[["en_attente","En attente"],["valide","Actifs"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex:1,padding:"10px",border:"none",borderRadius:"8px",background:tab===k?"#f5c842":"transparent",color:tab===k?"#000":"#555",fontWeight:700,fontSize:"13px",cursor:"pointer" }}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center",padding:"40px",color:"#444" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:"40px",color:"#444",fontSize:"13px" }}>Aucun enregistrement</div>
        ) : (
          filtered.map(d => (
            <div key={d.id} style={{ background:"#111",borderRadius:"12px",padding:"14px",marginBottom:"10px",border:"1px solid #1a1a1a" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:"15px" }}>{d.nom}</div>
                  <div style={{ fontSize:"12px",color:"#555",marginTop:"2px" }}>{d.marque} {d.modele} · {d.quartier}</div>
                </div>
                <Badge color={d.abonnement_actif ? "#25d366" : "#f5c842"}>
                  {d.abonnement_actif ? "Actif" : "En attente"}
                </Badge>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"12px" }}>
                {d.telephone && <Badge color="#25d366">📞 {d.telephone}</Badge>}
                {d.type_vehicule && <Badge>{d.type_vehicule}</Badge>}
                {d.prix_jour && <Badge color="#7eb8c8">{Number(d.prix_jour).toLocaleString()} F/j</Badge>}
              </div>
              <div style={{ display:"flex",gap:"8px" }}>
                {!d.abonnement_actif ? (
                  <button onClick={() => activer(d.id)} style={{ flex:1,padding:"10px",background:"rgba(37,211,102,0.15)",border:"1px solid rgba(37,211,102,0.3)",borderRadius:"8px",color:"#25d366",fontWeight:700,fontSize:"13px",cursor:"pointer" }}>
                    Activer
                  </button>
                ) : (
                  <button onClick={() => desactiver(d.id)} style={{ flex:1,padding:"10px",background:"rgba(255,200,0,0.1)",border:"1px solid rgba(255,200,0,0.2)",borderRadius:"8px",color:"#f5c842",fontWeight:700,fontSize:"13px",cursor:"pointer" }}>
                    Desactiver
                  </button>
                )}
                <a href={`https://wa.me/${d.telephone}`} target="_blank" rel="noreferrer" style={{ flex:1,padding:"10px",background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:"8px",color:"#25d366",fontWeight:700,fontSize:"13px",cursor:"pointer",textDecoration:"none",textAlign:"center" }}>
                  WhatsApp
                </a>
                <button onClick={() => supprimer(d.id)} style={{ padding:"10px 14px",background:"rgba(255,80,80,0.08)",border:"1px solid rgba(255,80,80,0.2)",borderRadius:"8px",color:"#f66",fontWeight:700,fontSize:"13px",cursor:"pointer" }}>
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────

export default function DLoca() {
  const [page, setPage] = useState("client");

  return (
    <div>
      {page === "client" && <PageClient onRegister={() => setPage("proprio")} />}
      {page === "proprio" && <PageProprio onBack={() => setPage("client")} />}
      {page === "admin" && <PageAdmin onBack={() => setPage("client")} />}

      {/* Bouton admin discret */}
      {page === "client" && (
        <button
          onClick={() => setPage("admin")}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "#333",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙
        </button>
      )}
    </div>
  );
}
