var btn = document.getElementById("open");
var letter = document.getElementById("letter");

// Pluie de cœurs
function hearts() {
  for (var i = 0; i < 28; i++) {
    var h = document.createElement("span");
    h.className = "heart";
    h.textContent = "♥";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = (14 + Math.random() * 26) + "px";
    h.style.animationDuration = (3 + Math.random() * 3) + "s";
    h.style.animationDelay = (Math.random() * 1.2) + "s";
    document.body.appendChild(h);
    setTimeout(function (el) { el.remove(); }.bind(null, h), 8000);
  }
}

// Ouvrir / refermer la lettre
btn.addEventListener("click", function () {
  var open = letter.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
  btn.textContent = open ? "Refermer la lettre" : "Ouvre ma lettre pour toi";
  if (open) {
    hearts();
    setTimeout(function () {
      letter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }
});

// Télécharger la carte (un seul fichier HTML autonome : CSS, JS et photo inclus)
function blobToDataURI(blob) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { resolve(r.result); };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

document.getElementById("keep").addEventListener("click", async function () {
  var msg = document.getElementById("keepmsg");
  msg.textContent = "Préparation de la carte…";
  try {
    var files = await Promise.all([
      fetch("style.css").then(function (r) { if (!r.ok) throw 0; return r.text(); }),
      fetch("script.js").then(function (r) { if (!r.ok) throw 0; return r.text(); }),
      fetch("Img.jpeg").then(function (r) { if (!r.ok) throw 0; return r.blob(); })
    ]);
    var css = files[0], js = files[1];
    var photo = await blobToDataURI(files[2]);

    var doc = document.documentElement.cloneNode(true);
    doc.querySelectorAll(".heart, footer .keep, #keepmsg").forEach(function (e) { e.remove(); });
    doc.querySelector('link[href="style.css"]').remove();
    doc.querySelector('script[src="script.js"]').remove();
    doc.querySelector("#photo, .polaroid img").setAttribute("src", photo);
    doc.querySelector("#letter").classList.remove("open");
    var o = doc.querySelector("#open");
    o.setAttribute("aria-expanded", "false");
    o.textContent = "Ouvre ma lettre pour toi";

    var style = document.createElement("style");
    style.textContent = css;
    doc.querySelector("head").appendChild(style);
    var script = document.createElement("script");
    script.textContent = js;
    doc.querySelector("body").appendChild(script);

    var html = "<!DOCTYPE html>\n" + doc.outerHTML;
    var url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = "carte-anniversaire-kinee.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    msg.textContent = "Carte enregistrée ♥ Ouvre le fichier quand tu veux.";
  } catch (e) {
    msg.textContent = "Le téléchargement ne marche que depuis le lien en ligne de la carte.";
  }
});
