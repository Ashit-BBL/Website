/* ─── Ashit Gandhi Photography — Photo Slot Manifest ─────────────────────────
   HOW IT WORKS
   ─────────────────────────────────────────────────────────────────────────────
   Images live in your GitHub repo at:
     assets/hero/01.jpg … 05.jpg
     assets/birds/01.jpg … 08.jpg
     assets/macro/01.jpg … 08.jpg
     assets/landscape/01.jpg … 08.jpg
     assets/composites/01.jpg … 08.jpg

   To ADD or REPLACE a photo: upload the file to the matching folder on GitHub
   with the correct number name (e.g. birds/03.jpg). The site picks it up
   automatically — no code changes needed.

   To REMOVE a photo: delete the file from GitHub. That slot goes dark.

   To UPDATE titles / locations: edit the matching entry below and commit.

   IN-TOOL PREVIEW: open the Photo Manager panel (Shift+M or footer link),
   drag an image onto a slot. That stores a local preview in the browser only —
   it does NOT replace the GitHub file.
   ─────────────────────────────────────────────────────────────────────────── */

(function () {

  window.PHOTO_SLOTS = {

    hero: [
      { id: 'hero-01', title: 'Sunrise · Himalayas',   loc: 'Sattal, Uttarakhand' },
      { id: 'hero-02', title: 'Black Kite',             loc: 'Vadodara'            },
      { id: 'hero-03', title: 'Blackbuck in Flight',    loc: 'Tal Chhapar'         },
      { id: 'hero-04', title: 'River Terns',            loc: 'Kotna Beach'         },
      { id: 'hero-05', title: 'Pondicherry Sunrise',    loc: 'Pondicherry'         },
    ],

    birds: [
      { id: 'birds-01', title: 'Shikra on Perch',          loc: 'Vadodara',        asp: 480/599 },
      { id: 'birds-02', title: 'Indian White-eye',          loc: 'Vadodara',        asp: 960/768 },
      { id: 'birds-03', title: 'Asian Green Bee-eater',     loc: 'Gujarat',         asp: 960/768 },
      { id: 'birds-04', title: 'White Wagtail',             loc: 'Kotna Beach',     asp: 960/768 },
      { id: 'birds-05', title: 'Rose-ringed Parakeet',      loc: 'Vadodara',        asp: 960/768 },
      { id: 'birds-06', title: 'Little Egret · Two Fish',   loc: 'Timbi Lake',      asp: 480/599 },
      { id: 'birds-07', title: 'Eurasian Hobby',            loc: 'Tal Chhapar',     asp: 480/600 },
      { id: 'birds-08', title: 'Greylag Goose',             loc: 'Bherai, Gujarat', asp: 480/600 },
    ],

    macro: [
      { id: 'macro-01', title: 'Garden Lizard',        loc: 'Gujarat',     asp: 480/601 },
      { id: 'macro-02', title: 'Robber Fly',           loc: 'Macro Study', asp: 960/767 },
      { id: 'macro-03', title: 'Giant Orb Weaver',     loc: 'Gujarat',     asp: 480/600 },
      { id: 'macro-04', title: 'Spiny-tailed Lizard',  loc: 'Tal Chhapar', asp: 480/600 },
      { id: 'macro-05', title: 'Jumping Spider',       loc: 'Vadodara',    asp: 960/767 },
      { id: 'macro-06', title: 'Dragonfly at Rest',    loc: 'Gujarat',     asp: 960/768 },
      { id: 'macro-07', title: 'Praying Mantis',       loc: 'Polo Forest', asp: 480/600 },
      { id: 'macro-08', title: 'Close Study',          loc: 'Gujarat',     asp: 960/768 },
    ],

    landscape: [
      { id: 'landscape-01', title: 'Harnav River',          loc: 'Polo Forest',   asp: 960/541 },
      { id: 'landscape-02', title: 'Blackbuck · in Flight', loc: 'Tal Chhapar',   asp: 960/770 },
      { id: 'landscape-03', title: 'Desert Dunes',          loc: 'Rann of Kutch', asp: 960/540 },
      { id: 'landscape-04', title: 'Polo Forest at Dawn',   loc: 'Gujarat',       asp: 960/541 },
      { id: 'landscape-05', title: 'Manas River',           loc: 'Assam',         asp: 960/540 },
      { id: 'landscape-06', title: 'Salt Flats at Dusk',    loc: 'Little Rann',   asp: 960/541 },
      { id: 'landscape-07', title: 'Valley Mist',           loc: 'Sattal',        asp: 960/541 },
      { id: 'landscape-08', title: 'Wetlands at Sunrise',   loc: 'Gujarat',       asp: 960/541 },
    ],

    composites: [
      { id: 'composites-01', title: 'Composite 01', loc: '', asp: 960/540 },
      { id: 'composites-02', title: 'Composite 02', loc: '', asp: 960/540 },
      { id: 'composites-03', title: 'Composite 03', loc: '', asp: 960/540 },
      { id: 'composites-04', title: 'Composite 04', loc: '', asp: 960/540 },
      { id: 'composites-05', title: 'Composite 05', loc: '', asp: 960/540 },
      { id: 'composites-06', title: 'Composite 06', loc: '', asp: 960/540 },
      { id: 'composites-07', title: 'Composite 07', loc: '', asp: 960/540 },
      { id: 'composites-08', title: 'Composite 08', loc: '', asp: 960/540 },
    ],
  };

  /* ─── Resolve a slot to a src string ──────────────────────────────────────
     Priority:
       1. localStorage data-URL  (in-tool drag-drop preview)
       2. Relative path in repo  (assets/{cat}/{num}.jpg)
     Returns a string — caller must verify the URL actually loads.           */
  window.getSlotSrc = function (id) {
    try {
      var stored = localStorage.getItem('img-slot-' + id);
      if (stored) return stored;
    } catch (e) {}

    var m = id.match(/^([a-z]+)-(\d+)$/);
    if (!m) return null;
    return 'assets/' + m[1] + '/' + m[2] + '.jpg';
  };

  /* ─── Save a dragged file into localStorage (in-tool preview only) ───────── */
  window.setSlotFile = function (id, file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var MAX = 1400;
          var scale = Math.min(1, MAX / img.naturalWidth);
          var canvas = document.createElement('canvas');
          canvas.width  = Math.round(img.naturalWidth  * scale);
          canvas.height = Math.round(img.naturalHeight * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          var trySave = function (q) {
            var dataUrl = canvas.toDataURL('image/jpeg', q);
            try {
              localStorage.setItem('img-slot-' + id, dataUrl);
              window.dispatchEvent(new CustomEvent('slots-updated', { detail: { id: id } }));
              resolve(dataUrl);
            } catch (err) {
              if (q > 0.35) trySave(q - 0.18);
              else reject(new Error('Storage full — clear some slots first.'));
            }
          };
          trySave(0.82);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /* ─── Remove localStorage override for a slot ────────────────────────────── */
  window.clearSlot = function (id) {
    try { localStorage.removeItem('img-slot-' + id); } catch (e) {}
    window.dispatchEvent(new CustomEvent('slots-updated', { detail: { id: id } }));
  };

  /* ─── Flat list of all non-hero slots (for gallery) ──────────────────────── */
  window.getAllPhotoSlots = function () {
    var cats = ['birds', 'macro', 'landscape', 'composites'];
    var out = [];
    cats.forEach(function (cat) {
      window.PHOTO_SLOTS[cat].forEach(function (s) {
        out.push(Object.assign({}, s, { cat: cat }));
      });
    });
    return out;
  };

})();
