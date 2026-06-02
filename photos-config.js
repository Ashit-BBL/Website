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
      { id: 'hero-01', title: 'River Tern - Composite',   loc: 'Kotna, Gujarat' },
      { id: 'hero-02', title: 'Himalayas',             loc: 'Mussourie, Uttarakhand'            },
      { id: 'hero-03', title: 'Great Indian Bustard',    loc: 'Desert National Park, Rajasthan'         },
      { id: 'hero-04', title: 'Sunrise',            loc: 'Manila, Uttarakhand'         },
      { id: 'hero-05', title: 'Pangong Tso',    loc: 'Ladakh'         },
    ],

    birds: [
      { id: 'birds-01', title: 'Indian White-eye',          loc: 'Udaipur',        asp: 480/599 },
      { id: 'birds-02', title: 'Red-breasted Flycatcher',          loc: 'Padra, Vadodara',        asp: 960/768 },
      { id: 'birds-03', title: 'Blue-tailed Bee-eater',     loc: 'Sindhrot, Vadodara',         asp: 960/768 },
      { id: 'birds-04', title: 'Houser Sparrow',             loc: 'Vadodara',     asp: 960/768 },
      { id: 'birds-05', title: 'Yellow-crowned Woodpecker',      loc: 'Timbi, Vadodara',        asp: 960/768 },
      { id: 'birds-06', title: 'Laggar Falcon',   loc: 'Desert National Park, Rajasthan',      asp: 480/599 },
      { id: 'birds-07', title: 'Spotted Owlet',            loc: 'Sindhrot, Vadodara',     asp: 480/600 },
      { id: 'birds-08', title: 'Asian Green Bee-eaters',    loc: 'Timbi, Vadodara', asp: 480/600 },
      { id: 'birds-09', title: 'Great Indian Bustard',    loc: 'Desert National Park, Rajasthan', asp: 480/600 },
      { id: 'birds-10', title: 'Crested Serpent Eagle',    loc: 'Shoolpaneshwar, Gujarat', asp: 480/600 },
      { id: 'birds-11', title: 'Woolly-necked Stork',    loc: 'Timbi, Vadodara', asp: 480/600 },

    ],

    macro: [
      { id: 'macro-01', title: 'Dragonfly Eyes',        loc: 'Vadodara',     asp: 480/601 },
      { id: 'macro-02', title: 'Peacock Pansy Butterfly Wing',           loc: 'Vadodara', asp: 960/767 },
      { id: 'macro-03', title: 'Jumping Spider',     loc: 'Vadodara',     asp: 480/600 },
      { id: 'macro-04', title: 'Jumping Spider',  loc: 'Vadodara', asp: 480/600 },
      { id: 'macro-05', title: 'Dew Drops',       loc: 'Vadodara',    asp: 960/767 },
      { id: 'macro-06', title: 'Jumping Spider',    loc: 'Vadodara',     asp: 960/768 },
      { id: 'macro-07', title: 'Jumping Spider',       loc: 'Vadodara', asp: 480/600 },
      { id: 'macro-08', title: 'Orb-Web Spider',          loc: 'Vadodara',     asp: 960/768 },
    ],

    landscape: [
      { id: 'landscape-01', title: 'Goa',          loc: '',   asp: 960/541 },
      { id: 'landscape-02', title: 'Mussourie', loc: '',   asp: 960/770 },
      { id: 'landscape-03', title: 'Manila, Uttarakhand',          loc: '', asp: 960/540 },
      { id: 'landscape-04', title: 'Hunder, Ladakh',   loc: '',       asp: 960/541 },
      { id: 'landscape-05', title: 'Pangong Tso, Ladakh',           loc: '',         asp: 960/540 },
      { id: 'landscape-06', title: 'Tal Chhappar, Rajasthan',    loc: '',   asp: 960/541 },
      { id: 'landscape-07', title: 'Rock Beach, Pondicherry',           loc: '',        asp: 960/541 },
      { id: 'landscape-08', title: 'Bharatpur Bird Sanctuary',   loc: '',       asp: 960/541 },
      { id: 'landscape-09', title: 'Bharatpur Bird Sanctuary',   loc: '',       asp: 960/541 },
      { id: 'landscape-10', title: 'Rock Beach, Pondicherry',    loc: '',       asp: 960/541 },
      { id: 'landscape-11', title: 'Bharatpur Bird Sanctuary',   loc: '',       asp: 960/541 },
      { id: 'landscape-12', title: 'Bharatpur Bird Sanctuary',   loc: '',       asp: 960/541 },

    ],

    composites: [
      { id: 'composites-01', title: 'Siberian Stonechat', loc: 'Timbi, Vadodara', asp: 960/540 },
      { id: 'composites-02', title: 'Eastern Imperial Eagle', loc: 'Little Rann of Kutch', asp: 960/540 },
      { id: 'composites-03', title: 'Pied Kingfisher', loc: 'Timbi, Vadodara', asp: 960/540 },
      { id: 'composites-04', title: 'Asian Green Bee-eater', loc: 'Vadodara', asp: 960/540 },
      { id: 'composites-05', title: 'River Tern', loc: 'Kotna, Vadodara', asp: 960/540 },
      { id: 'composites-06', title: 'Composite 06', loc: '', asp: 960/540 },
      { id: 'composites-07', title: 'Indian Roller', loc: 'Timbi, Vadodara', asp: 960/540 },
      { id: 'composites-08', title: 'Short-toed Snake Eagle', loc: 'Vadhwana', asp: 960/540 },
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
