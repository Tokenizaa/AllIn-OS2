globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HTTPError, d as defineLazyEventHandler, a as H3Core } from "./_libs/h3.mjs";
import { H as HookableCore } from "./_libs/hookable.mjs";

import { a as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/accordion-CQlGK3eK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2554-H7RcpFzeygTq94JAT/orYEjkHWQ"',
    "mtime": "2026-06-02T03:06:05.447Z",
    "size": 9556,
    "path": "../public/assets/accordion-CQlGK3eK.js"
  },
  "/assets/activity-CyEtA8mb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"eb-gvdYcHGiq7rbkraVFdjLRFDvi6M"',
    "mtime": "2026-06-02T03:06:05.424Z",
    "size": 235,
    "path": "../public/assets/activity-CyEtA8mb.js"
  },
  "/assets/alerts-DBeXSXNX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6d1-oWGYK8jevzkCHJMsLFBrgb33oNY"',
    "mtime": "2026-06-02T03:06:05.447Z",
    "size": 1745,
    "path": "../public/assets/alerts-DBeXSXNX.js"
  },
  "/assets/analytics-CYG86Csv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1c0f-fZe3dfNOcwmgROERzOF5DAUid1s"',
    "mtime": "2026-06-02T03:06:05.446Z",
    "size": 7183,
    "path": "../public/assets/analytics-CYG86Csv.js"
  },
  "/assets/AreaChart-k0E-0csd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2ae5-XClYR+O8OmCXR/VTvD9LAWtqI9Q"',
    "mtime": "2026-06-02T03:06:05.434Z",
    "size": 10981,
    "path": "../public/assets/AreaChart-k0E-0csd.js"
  },
  "/assets/arrow-down-right-Cw0gTEjW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"aa-G27uNZ3YQi2Tv/imAkMlkPo4x4s"',
    "mtime": "2026-06-02T03:06:05.434Z",
    "size": 170,
    "path": "../public/assets/arrow-down-right-Cw0gTEjW.js"
  },
  "/assets/arrow-up-right-boZ8Trmz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a8-Ys00A7e+FwweOxG9+lGJoo4I1vc"',
    "mtime": "2026-06-02T03:06:05.434Z",
    "size": 168,
    "path": "../public/assets/arrow-up-right-boZ8Trmz.js"
  },
  "/assets/ativacao-B7aLye7X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b5c-LcaQbOErVdPSR9fAw/XCnMXNstQ"',
    "mtime": "2026-06-02T03:06:05.400Z",
    "size": 15196,
    "path": "../public/assets/ativacao-B7aLye7X.js"
  },
  "/assets/auth.invite._token-BPrBI7h3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2d18-UjWZ2pmfKdHokQpuTur/JQ63hgg"',
    "mtime": "2026-06-02T03:06:05.634Z",
    "size": 11544,
    "path": "../public/assets/auth.invite._token-BPrBI7h3.js"
  },
  "/assets/avatar-SOld57qg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"df3-wKB+iyC2g1cd/pRjR9rpA26zrvc"',
    "mtime": "2026-06-02T03:06:05.400Z",
    "size": 3571,
    "path": "../public/assets/avatar-SOld57qg.js"
  },
  "/assets/award-CkC3fGlH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10e-nFpbGyv3UwfjoRIHtpUROXSK2rU"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 270,
    "path": "../public/assets/award-CkC3fGlH.js"
  },
  "/assets/BarChart-DamYGy7Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"13e-fedAH2UUEtmalLiU4qk58aFmKhE"',
    "mtime": "2026-06-02T03:06:05.434Z",
    "size": 318,
    "path": "../public/assets/BarChart-DamYGy7Z.js"
  },
  "/assets/bot-C5TjXHE8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-b1TW3b0pkw9SG5bwu6ZkAd84oEk"',
    "mtime": "2026-06-02T03:06:05.437Z",
    "size": 329,
    "path": "../public/assets/bot-C5TjXHE8.js"
  },
  "/assets/busca-produtos-B8WxPrgB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dca-Wk8RrqUsyQ+QbPPQKmLT/bpHTIg"',
    "mtime": "2026-06-02T03:06:05.399Z",
    "size": 3530,
    "path": "../public/assets/busca-produtos-B8WxPrgB.js"
  },
  "/assets/busca-produtos._slug-Biwvgczi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e17-RDEkzLRoqB37bFoZ3GDW29woPU0"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 3607,
    "path": "../public/assets/busca-produtos._slug-Biwvgczi.js"
  },
  "/assets/cadastro-BiXo7TiU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2504-qK53BZbokTWmKoQK+D3kYdyFPuk"',
    "mtime": "2026-06-02T03:06:05.399Z",
    "size": 9476,
    "path": "../public/assets/cadastro-BiXo7TiU.js"
  },
  "/assets/card-yzbQXaPp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3d6-59nsgZQXHI/YbSQP5L0a6H2m7bM"',
    "mtime": "2026-06-02T03:06:05.419Z",
    "size": 982,
    "path": "../public/assets/card-yzbQXaPp.js"
  },
  "/assets/CartSidebar-B4Z7RK7W.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7c07-LvRfXTjWacslifhh9TAHqB2ocY4"',
    "mtime": "2026-06-02T03:06:05.407Z",
    "size": 31751,
    "path": "../public/assets/CartSidebar-B4Z7RK7W.js"
  },
  "/assets/chart-column-DIU772Nf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-0n+IJmIBJt7PQ2i3CxZFHWEKhDs"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 252,
    "path": "../public/assets/chart-column-DIU772Nf.js"
  },
  "/assets/check-DyPYPdjF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"78-v4hE5Y5GbVb9WnW5kDzyvk/93VM"',
    "mtime": "2026-06-02T03:06:05.421Z",
    "size": 120,
    "path": "../public/assets/check-DyPYPdjF.js"
  },
  "/assets/checkout-D62hA6Wq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4a-AaHltyRb5HhaBxOYRc+kMWYfNwI"',
    "mtime": "2026-06-02T03:06:05.399Z",
    "size": 74,
    "path": "../public/assets/checkout-D62hA6Wq.js"
  },
  "/assets/chevron-down-WwwJ9hTv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"81-F7mk115T9RfYdztZSyphAkRGk9Y"',
    "mtime": "2026-06-02T03:06:05.418Z",
    "size": 129,
    "path": "../public/assets/chevron-down-WwwJ9hTv.js"
  },
  "/assets/chevron-left-CpyXXko6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"83-OFlvD1bocFEwo/a0hf5GgoX4sUo"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 131,
    "path": "../public/assets/chevron-left-CpyXXko6.js"
  },
  "/assets/clock-DDyIbXZB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a5-qsCxUp/gOqyjDoFKu/tqaS7UPdY"',
    "mtime": "2026-06-02T03:06:05.420Z",
    "size": 165,
    "path": "../public/assets/clock-DDyIbXZB.js"
  },
  "/assets/commissions--um0U7dN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"de1-mZfbGh+s/9DW3IMYhQXWZ0ifosk"',
    "mtime": "2026-06-02T03:06:05.446Z",
    "size": 3553,
    "path": "../public/assets/commissions--um0U7dN.js"
  },
  "/assets/copilot-5kBtd-ko.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17bd-rT5facoA4mZwZsw+1SKHZCjvQFc"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 6077,
    "path": "../public/assets/copilot-5kBtd-ko.js"
  },
  "/assets/copilot-BLGyjzaT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d5-xvpgfxVWsMoVV7JgeSG1olaGuWk"',
    "mtime": "2026-06-02T03:06:05.446Z",
    "size": 2261,
    "path": "../public/assets/copilot-BLGyjzaT.js"
  },
  "/assets/copy-B6j3rRzr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e8-6mHryNxWzzKWlDWXGq7RFYdHX3c"',
    "mtime": "2026-06-02T03:06:05.418Z",
    "size": 232,
    "path": "../public/assets/copy-B6j3rRzr.js"
  },
  "/assets/crown-DGOYd4hv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16b-slqIy1PwB5PQgTdePmiFbxXrtsY"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 363,
    "path": "../public/assets/crown-DGOYd4hv.js"
  },
  "/assets/customer-label-B1z5j7PV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dd-gANXdKKaQdaOWCXMEigJaQ21La0"',
    "mtime": "2026-06-02T03:06:05.437Z",
    "size": 221,
    "path": "../public/assets/customer-label-B1z5j7PV.js"
  },
  "/assets/dialog-Br9R34_r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7dd-kNc7VFM4i7ZkPF5mykRVDtMZGeA"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 2013,
    "path": "../public/assets/dialog-Br9R34_r.js"
  },
  "/assets/DiseaseCard-GARlblvX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"544-TMx1GtAvqVz5ENCaidsLLkWFwfE"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 1348,
    "path": "../public/assets/DiseaseCard-GARlblvX.js"
  },
  "/assets/doencas-BJKoPRv1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d07-OL1ZZCB1kBt9Db52l7tnomgbaJ0"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 3335,
    "path": "../public/assets/doencas-BJKoPRv1.js"
  },
  "/assets/doencas._slug-CP2csLlN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d54-RRO2tBU9bqIGKJYGZCFVtPRVZfo"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 3412,
    "path": "../public/assets/doencas._slug-CP2csLlN.js"
  },
  "/assets/dollar-sign-DDeScIWr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dc-46eBRduhH6wlIAbSg6rHWQr1QFc"',
    "mtime": "2026-06-02T03:06:05.419Z",
    "size": 220,
    "path": "../public/assets/dollar-sign-DDeScIWr.js"
  },
  "/assets/download-Bf3S18tv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e9-ccDa4zadykd1OKLggjSAIefKh94"',
    "mtime": "2026-06-02T03:06:05.423Z",
    "size": 233,
    "path": "../public/assets/download-Bf3S18tv.js"
  },
  "/assets/downloads-Bcdjup_3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1254-ackFha9r57IbfffZTqud1HU/9Qg"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 4692,
    "path": "../public/assets/downloads-Bcdjup_3.js"
  },
  "/assets/eye-zWMNmeU7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-NKUCF9iAZQ3wVKO1djc+Nh8JBes"',
    "mtime": "2026-06-02T03:06:05.425Z",
    "size": 252,
    "path": "../public/assets/eye-zWMNmeU7.js"
  },
  "/assets/file-text-Bhyt_dhb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"182-ZulhcDVuoa7zCK4oU/Hz0CMsXT0"',
    "mtime": "2026-06-02T03:06:05.435Z",
    "size": 386,
    "path": "../public/assets/file-text-Bhyt_dhb.js"
  },
  "/assets/finance-DCEMSmyM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1ab3-arqhOwW9cRzC8MrJ20O7qqFmzOA"',
    "mtime": "2026-06-02T03:06:05.447Z",
    "size": 6835,
    "path": "../public/assets/finance-DCEMSmyM.js"
  },
  "/assets/Footer-CNWigAuL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f24-iPw8cmCbt8Uy0wCQzJ8mz4cBeRk"',
    "mtime": "2026-06-02T03:06:05.416Z",
    "size": 3876,
    "path": "../public/assets/Footer-CNWigAuL.js"
  },
  "/assets/funnel-CYEXrUPX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-gFxbAui0PZA+iO97QofoJLqULiU"',
    "mtime": "2026-06-02T03:06:05.425Z",
    "size": 252,
    "path": "../public/assets/funnel-CYEXrUPX.js"
  },
  "/assets/headphones-CCeZcQ60.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ee-HXQ0q8JLgc+564Ctdbvya+UFiFM"',
    "mtime": "2026-06-02T03:06:05.398Z",
    "size": 238,
    "path": "../public/assets/headphones-CCeZcQ60.js"
  },
  "/assets/history-DENeOdOL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ee-E/IXO+202YxuUZQjD43RUr13zHM"',
    "mtime": "2026-06-02T03:06:05.416Z",
    "size": 238,
    "path": "../public/assets/history-DENeOdOL.js"
  },
  "/assets/index-B6lcjV93.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"108f-9/GvTYblibyju2Uf/Csn7rsTTG8"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 4239,
    "path": "../public/assets/index-B6lcjV93.js"
  },
  "/assets/generateCategoricalChart-C_znVHrn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5dd26-hB/GxCfH60zntqyeKbuIKiZhDu8"',
    "mtime": "2026-06-02T03:06:05.433Z",
    "size": 384294,
    "path": "../public/assets/generateCategoricalChart-C_znVHrn.js"
  },
  "/assets/index-BAjG7aIS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9f3-FhgGRIlLwSTJAqVaWUvJvbpzX3I"',
    "mtime": "2026-06-02T03:06:05.447Z",
    "size": 2547,
    "path": "../public/assets/index-BAjG7aIS.js"
  },
  "/assets/index-Bi8oZ6ow.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"931-MrKUVPGvThgpETVCkX417ApWBTA"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 2353,
    "path": "../public/assets/index-Bi8oZ6ow.js"
  },
  "/assets/index-BLTu5g1L.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"432a-jpcQ7qgduLftXWvJyJuO43cKTJ0"',
    "mtime": "2026-06-02T03:06:05.406Z",
    "size": 17194,
    "path": "../public/assets/index-BLTu5g1L.js"
  },
  "/assets/index-C4ymI3xS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a5f-CwpKg8JZtR8VIWzK6CvHYkLFDiI"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 2655,
    "path": "../public/assets/index-C4ymI3xS.js"
  },
  "/assets/index-CHvmDt1-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2d7-mV2fE+cu3dSsx2a8+OjUIZIyXeM"',
    "mtime": "2026-06-02T03:06:05.438Z",
    "size": 727,
    "path": "../public/assets/index-CHvmDt1-.js"
  },
  "/assets/index-CokFu0DA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c38-7FlN0xTb8CGg/5wh/bWvZB6/LUc"',
    "mtime": "2026-06-02T03:06:05.448Z",
    "size": 3128,
    "path": "../public/assets/index-CokFu0DA.js"
  },
  "/assets/index-DEOYzyQm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4d05-Ph9m5E3phDfUNMTkhqu6oZaJ7eQ"',
    "mtime": "2026-06-02T03:06:05.418Z",
    "size": 19717,
    "path": "../public/assets/index-DEOYzyQm.js"
  },
  "/assets/index-DTGGGDdO.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"2d5a6-lorpjUIES/MGYhtqxE88bwuI3+Q"',
    "mtime": "2026-06-02T03:06:05.438Z",
    "size": 185766,
    "path": "../public/assets/index-DTGGGDdO.css"
  },
  "/assets/index-DY5LekOQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1988-lhqE3dKL5ERQLxZwpHsOq6tuNz0"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 6536,
    "path": "../public/assets/index-DY5LekOQ.js"
  },
  "/assets/index-jZI01qkQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2d35-B58XrYTlwbKn2DgyXptjc++ipWU"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 11573,
    "path": "../public/assets/index-jZI01qkQ.js"
  },
  "/assets/index-YcBLuf7O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2377-VrlOo6Lw2PSJ26fpnau0v8EdfcE"',
    "mtime": "2026-06-02T03:06:05.449Z",
    "size": 9079,
    "path": "../public/assets/index-YcBLuf7O.js"
  },
  "/assets/info-Cf4jjLEV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8-cayBDCmPGaXbNanficZrM79jnDA"',
    "mtime": "2026-06-02T03:06:05.621Z",
    "size": 200,
    "path": "../public/assets/info-Cf4jjLEV.js"
  },
  "/assets/input-CLSYxe0X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22d-MtYelCHXi1l96667CQXGu/6+7cQ"',
    "mtime": "2026-06-02T03:06:05.421Z",
    "size": 557,
    "path": "../public/assets/input-CLSYxe0X.js"
  },
  "/assets/insights-0XS8Otw1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1159-P3WcrL7yqcyz180jxdrYJaP/OBI"',
    "mtime": "2026-06-02T03:06:05.445Z",
    "size": 4441,
    "path": "../public/assets/insights-0XS8Otw1.js"
  },
  "/assets/instagram-BKgNsr-_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"129-lY+5OMbBiY954fhupMtOMBL2dvQ"',
    "mtime": "2026-06-02T03:06:05.406Z",
    "size": 297,
    "path": "../public/assets/instagram-BKgNsr-_.js"
  },
  "/assets/kpi-card-CofhdWuU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"597-UXrRp7qqaO1cctRl5wgrLLofIMs"',
    "mtime": "2026-06-02T03:06:05.438Z",
    "size": 1431,
    "path": "../public/assets/kpi-card-CofhdWuU.js"
  },
  "/assets/layers-pcUgp-T3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a6-vMHH215krByas6a7wDrHdR21jgk"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 422,
    "path": "../public/assets/layers-pcUgp-T3.js"
  },
  "/assets/LineChart-C3OHrfFa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b7c-kMhnxUe0PwlMSVu7vihI9QDssF4"',
    "mtime": "2026-06-02T03:06:05.437Z",
    "size": 11132,
    "path": "../public/assets/LineChart-C3OHrfFa.js"
  },
  "/assets/lock-D7nJuYOk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ca-9J5Ihx7hbLBbTNvZHXe8bLUPtgo"',
    "mtime": "2026-06-02T03:06:05.421Z",
    "size": 202,
    "path": "../public/assets/lock-D7nJuYOk.js"
  },
  "/assets/log-in-BQEK_5GK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"266-b6+y/uXF2JVGTO50NpBtIRpFemo"',
    "mtime": "2026-06-02T03:06:05.425Z",
    "size": 614,
    "path": "../public/assets/log-in-BQEK_5GK.js"
  },
  "/assets/log-out-BaMvXdtn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"219d-16rDxBqMXYOkBhgJydBMfByIGa8"',
    "mtime": "2026-06-02T03:06:05.400Z",
    "size": 8605,
    "path": "../public/assets/log-out-BaMvXdtn.js"
  },
  "/assets/login-DAO9FyIv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2347-BFCiveRkSnqbHIEQTPzCI4Gs5As"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 9031,
    "path": "../public/assets/login-DAO9FyIv.js"
  },
  "/assets/loja-ClrXRWzX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3e40-86YYbtzd2zWy6oZN0iNTrFRh6Wc"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 15936,
    "path": "../public/assets/loja-ClrXRWzX.js"
  },
  "/assets/mail-DIo0YvbR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d6-bnpO5+TP0BD8DILckuVBcIzBtfQ"',
    "mtime": "2026-06-02T03:06:05.424Z",
    "size": 214,
    "path": "../public/assets/mail-DIo0YvbR.js"
  },
  "/assets/map-pin-BWRgUqS1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ff-r3wdgHrfvGxhqLd7xlmMCFGBE8E"',
    "mtime": "2026-06-02T03:06:05.423Z",
    "size": 255,
    "path": "../public/assets/map-pin-BWRgUqS1.js"
  },
  "/assets/marketing-CMQMgFwq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"91b-NFGkNfgZoW3d7UjThQMR7M9q0o4"',
    "mtime": "2026-06-02T03:06:05.445Z",
    "size": 2331,
    "path": "../public/assets/marketing-CMQMgFwq.js"
  },
  "/assets/megaphone-B4vEj2Rq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"15b-gPqwjS93ktW7QOCZg3OFCTHQ8qo"',
    "mtime": "2026-06-02T03:06:05.432Z",
    "size": 347,
    "path": "../public/assets/megaphone-B4vEj2Rq.js"
  },
  "/assets/mlm-rules-C1rmhqb6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4fe-+9a8RQCgcECIBNIG60N+1AGstsc"',
    "mtime": "2026-06-02T03:06:05.436Z",
    "size": 1278,
    "path": "../public/assets/mlm-rules-C1rmhqb6.js"
  },
  "/assets/index-DQpmbpGL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c7c18-jKghsI/wQu8VgpyAZbh4CBFS8PU"',
    "mtime": "2026-06-02T03:06:05.631Z",
    "size": 818200,
    "path": "../public/assets/index-DQpmbpGL.js"
  },
  "/assets/network-CVMPYebZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"181-Ozy9b9uaVQ9z/9zU0YRAdQmI4OU"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 385,
    "path": "../public/assets/network-CVMPYebZ.js"
  },
  "/assets/network-D9yA2TJu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1678-HKrl8UTUmXWEuwS2F9qOaD71xvo"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 5752,
    "path": "../public/assets/network-D9yA2TJu.js"
  },
  "/assets/network-D2NSy1Es.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5a1e-+kZVrGd0wwPgw78KBYfLGNWnG6I"',
    "mtime": "2026-06-02T03:06:05.445Z",
    "size": 23070,
    "path": "../public/assets/network-D2NSy1Es.js"
  },
  "/assets/office-CU-wZp1n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b80-CSoGvfHMprFApc5tLpf8NgmGuw0"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 7040,
    "path": "../public/assets/office-CU-wZp1n.js"
  },
  "/assets/orders-CFOUyrfa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1199-1i2Eq4vZ2PG3Z7KYdvApJi3kJ4Q"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 4505,
    "path": "../public/assets/orders-CFOUyrfa.js"
  },
  "/assets/orders.api-BF8M1hwJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"386-qCvF8TRvZiSgm9tE1KRfuNIHxNs"',
    "mtime": "2026-06-02T03:06:05.445Z",
    "size": 902,
    "path": "../public/assets/orders.api-BF8M1hwJ.js"
  },
  "/assets/page-header-DYoAByWB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"333-BKhBa6/trgDmC/vFhgEeTYwOhy8"',
    "mtime": "2026-06-02T03:06:05.437Z",
    "size": 819,
    "path": "../public/assets/page-header-DYoAByWB.js"
  },
  "/assets/phone-BfesT5YT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"143-FpgU84wDUNo0+GTH1/fjWCT7M0M"',
    "mtime": "2026-06-02T03:06:05.424Z",
    "size": 323,
    "path": "../public/assets/phone-BfesT5YT.js"
  },
  "/assets/PieChart-DjO2ddbt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b04-izPG6WUmt67Q0K8dpiFcGUZkvS0"',
    "mtime": "2026-06-02T03:06:05.434Z",
    "size": 23300,
    "path": "../public/assets/PieChart-DjO2ddbt.js"
  },
  "/assets/plan-wp84uBG-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1891-zacjzhNx5jQc+GXI1NW0hZvoc8U"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 6289,
    "path": "../public/assets/plan-wp84uBG-.js"
  },
  "/assets/plans-DVHJEF9a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"29c1-Xru1fqbnf4hHT+rzo53GR37E/ds"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 10689,
    "path": "../public/assets/plans-DVHJEF9a.js"
  },
  "/assets/Polygon-CviG5W8m.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b33-oOL+s0+G3hfQ5VCk/gmCYODiSLY"',
    "mtime": "2026-06-02T03:06:05.435Z",
    "size": 2867,
    "path": "../public/assets/Polygon-CviG5W8m.js"
  },
  "/assets/priceFormatter-DWzbcMur.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"144-q2stDP48HYRoDn0GNH8Q3d8hBmY"',
    "mtime": "2026-06-02T03:06:05.448Z",
    "size": 324,
    "path": "../public/assets/priceFormatter-DWzbcMur.js"
  },
  "/assets/ProductCard-BklrAir2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"67f-spIqw6AUyRe+BwHo1jPgi90k0is"',
    "mtime": "2026-06-02T03:06:05.416Z",
    "size": 1663,
    "path": "../public/assets/ProductCard-BklrAir2.js"
  },
  "/assets/produto._id-zOFG-17r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a49-FBKyU4pK9t3URHBKLyT0wGRv6CQ"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 6729,
    "path": "../public/assets/produto._id-zOFG-17r.js"
  },
  "/assets/profile-W2RkOjZs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18d8-J1f+vnLVZd9xJU59XnUviwqmU7Q"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 6360,
    "path": "../public/assets/profile-W2RkOjZs.js"
  },
  "/assets/progress-DZw0MxUR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c9b-2n9onlvA6VS0TcPweMuCYAB142w"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 3227,
    "path": "../public/assets/progress-DZw0MxUR.js"
  },
  "/assets/rbac-utils-DkKLJfN-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"39b-eZRf2e3bj7cW1GPhQtj+/usJ2YA"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 923,
    "path": "../public/assets/rbac-utils-DkKLJfN-.js"
  },
  "/assets/recuperar-senha-DMZlrDPl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fea-lE+9vALFHuF+KcRouYgM1q2OeVQ"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 4074,
    "path": "../public/assets/recuperar-senha-DMZlrDPl.js"
  },
  "/assets/redefinir-senha-Cf4MeIbC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10e8-rIJy1CP2IFrjwx93eQFNBd4fmW0"',
    "mtime": "2026-06-02T03:06:05.380Z",
    "size": 4328,
    "path": "../public/assets/redefinir-senha-Cf4MeIbC.js"
  },
  "/assets/refresh-cw-Czayy4gu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"142-YiQC8A0e2fyb6igF9tDEZywL+X8"',
    "mtime": "2026-06-02T03:06:05.446Z",
    "size": 322,
    "path": "../public/assets/refresh-cw-Czayy4gu.js"
  },
  "/assets/reports-CzGBOLPI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1ebc-jEFu2Cpq3Ti31UtNcopN+lJqv6U"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 7868,
    "path": "../public/assets/reports-CzGBOLPI.js"
  },
  "/assets/search-BmO7HENg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"aa-ehEABxA4YnWHS8p4rZhLwWR21vk"',
    "mtime": "2026-06-02T03:06:05.423Z",
    "size": 170,
    "path": "../public/assets/search-BmO7HENg.js"
  },
  "/assets/seja-distribuidor-xsnqKwVp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8a60-H8mSJNNH7htrvJUdpYVZHcEtFXU"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 35424,
    "path": "../public/assets/seja-distribuidor-xsnqKwVp.js"
  },
  "/assets/seja-distribuidor._slug-w_pdJ0zg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5a18-90vrKJnRCeHoCduhQQHSs7I0czw"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 23064,
    "path": "../public/assets/seja-distribuidor._slug-w_pdJ0zg.js"
  },
  "/assets/select-Cz8iCTAj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8aa-PxgQHlOegJlstj/VkewnFKzIFRI"',
    "mtime": "2026-06-02T03:06:05.418Z",
    "size": 51370,
    "path": "../public/assets/select-Cz8iCTAj.js"
  },
  "/assets/send-BA0grylV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"123-1/rnhIhhvS8q9wUa9HmJPiz4zI4"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 291,
    "path": "../public/assets/send-BA0grylV.js"
  },
  "/assets/settings-ByTsp1xx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"59a-UEnmXlRyb3FUtaD0lPD7Ev5Qo+A"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 1434,
    "path": "../public/assets/settings-ByTsp1xx.js"
  },
  "/assets/share-2-D0KtbKeF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"161-NK+ECwvIHMy1arLqFaBOG1FUaGA"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 353,
    "path": "../public/assets/share-2-D0KtbKeF.js"
  },
  "/assets/sheet-BYIZLR68.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8a3-6UCRWwZEGTrbbwv1eRytlTJrfg4"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 2211,
    "path": "../public/assets/sheet-BYIZLR68.js"
  },
  "/assets/shield-alert-DdNCkf47.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"162-8yrwysaPOZOrHQeW7JOnFMT5/V0"',
    "mtime": "2026-06-02T03:06:05.437Z",
    "size": 354,
    "path": "../public/assets/shield-alert-DdNCkf47.js"
  },
  "/assets/shield-BaCyegVY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10c-/QaSzLI+O4yCR6BfNHOjIIzJ35s"',
    "mtime": "2026-06-02T03:06:05.420Z",
    "size": 268,
    "path": "../public/assets/shield-BaCyegVY.js"
  },
  "/assets/shopping-cart-C4Bt2HYs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"120-A56MMz8Q1dXZ5H+94YfsQARmGk8"',
    "mtime": "2026-06-02T03:06:05.416Z",
    "size": 288,
    "path": "../public/assets/shopping-cart-C4Bt2HYs.js"
  },
  "/assets/skeleton-105rYahA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b1-c8imLjBuRcPbwLYAte8k7mOjunI"',
    "mtime": "2026-06-02T03:06:05.423Z",
    "size": 177,
    "path": "../public/assets/skeleton-105rYahA.js"
  },
  "/assets/sparkles-DTzPOR0l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1ef-tCydrvc/t7tSAN5ga8S/rjgkDYM"',
    "mtime": "2026-06-02T03:06:05.420Z",
    "size": 495,
    "path": "../public/assets/sparkles-DTzPOR0l.js"
  },
  "/assets/star-CHDumNHF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1d9-SDNHUzLErgLsc9/5t5Sx0syV3bQ"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 473,
    "path": "../public/assets/star-CHDumNHF.js"
  },
  "/assets/stat-card-Cxjh-a2h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6d9-e2jmtYKuj7Lzj2bx/ATcj/Uey98"',
    "mtime": "2026-06-02T03:06:05.415Z",
    "size": 1753,
    "path": "../public/assets/stat-card-Cxjh-a2h.js"
  },
  "/assets/store-C1AlYDFE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f3-hBu2NlyUcp/LxOURgTeeORbMK5E"',
    "mtime": "2026-06-02T03:06:05.416Z",
    "size": 499,
    "path": "../public/assets/store-C1AlYDFE.js"
  },
  "/assets/store-Pvp8rbx0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1229-+1DF3QEZhLAmcn18v6wxNdt3U5g"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 4649,
    "path": "../public/assets/store-Pvp8rbx0.js"
  },
  "/assets/success-team-C-dkeUXV.jpg": {
    "type": "image/jpeg",
    "etag": '"9a58-Sx5SHN5tPaYN4EcxCghSziNnBHM"',
    "mtime": "2026-06-02T03:06:05.178Z",
    "size": 39512,
    "path": "../public/assets/success-team-C-dkeUXV.jpg"
  },
  "/assets/switch-CLTKL2mb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d08-9gQp/kJW/2m5US4NZDzfAqP6/LU"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 3336,
    "path": "../public/assets/switch-CLTKL2mb.js"
  },
  "/assets/system-ChVm8OUn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10512-e3KHkE5gcY4huAkWKtiFDnKKLgQ"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 66834,
    "path": "../public/assets/system-ChVm8OUn.js"
  },
  "/assets/tabs-DyLL8EZi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a20-hd+eF/w8b9Z/BeJObGQb/IXzDz4"',
    "mtime": "2026-06-02T03:06:05.424Z",
    "size": 6688,
    "path": "../public/assets/tabs-DyLL8EZi.js"
  },
  "/assets/target-CUudH2ZZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"de-BXZ2wKya0a4Gh87p/rbDXYrUHmM"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 222,
    "path": "../public/assets/target-CUudH2ZZ.js"
  },
  "/assets/trending-up-JuJai-NU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b0-dvXRbw+9uGsGije6zYLOTexX6vM"',
    "mtime": "2026-06-02T03:06:05.419Z",
    "size": 176,
    "path": "../public/assets/trending-up-JuJai-NU.js"
  },
  "/assets/triangle-alert-C63yenSb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-o6xyfPUFnxbMEfqe+FFnq94KreA"',
    "mtime": "2026-06-02T03:06:05.432Z",
    "size": 266,
    "path": "../public/assets/triangle-alert-C63yenSb.js"
  },
  "/assets/trophy-COlZbGLk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1dd-39A4pcWw2ST2ynyKOiV0+hnh7pA"',
    "mtime": "2026-06-02T03:06:05.408Z",
    "size": 477,
    "path": "../public/assets/trophy-COlZbGLk.js"
  },
  "/assets/truck-v4fAzndM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22a-j4gJ3WtJQ909DDxDfbqpZId0mzs"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 554,
    "path": "../public/assets/truck-v4fAzndM.js"
  },
  "/assets/use-toast-CxO6eFPG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"54e-ZIhLiYb9onAM3UWwi3E+05p80qI"',
    "mtime": "2026-06-02T03:06:05.407Z",
    "size": 1358,
    "path": "../public/assets/use-toast-CxO6eFPG.js"
  },
  "/assets/useQuery-D3vc71gQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"333a-RZCt+BMNRMP+jOJReuIO60ZCoJA"',
    "mtime": "2026-06-02T03:06:05.444Z",
    "size": 13114,
    "path": "../public/assets/useQuery-D3vc71gQ.js"
  },
  "/assets/user-DNrbhQ9k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c0-jyiu6zTc60gRppGE2ocYGP0vOAg"',
    "mtime": "2026-06-02T03:06:05.423Z",
    "size": 192,
    "path": "../public/assets/user-DNrbhQ9k.js"
  },
  "/assets/user-plus-CTSn6uIf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"137-pZ/XIqubT+h7eQAQQIpRcDBdytc"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 311,
    "path": "../public/assets/user-plus-CTSn6uIf.js"
  },
  "/assets/users-DAIEQt2p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"133-DFREaiMLCFR7beY8rej0I0cyG/Y"',
    "mtime": "2026-06-02T03:06:05.420Z",
    "size": 307,
    "path": "../public/assets/users-DAIEQt2p.js"
  },
  "/assets/verification-D8Fj0lwH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16ea-2U3x95bhxi8gK9Y6GvanXlnCvJc"',
    "mtime": "2026-06-02T03:06:05.414Z",
    "size": 5866,
    "path": "../public/assets/verification-D8Fj0lwH.js"
  },
  "/assets/wallet-vofv3beR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11f-XonIP7oeBMbpkBcAYKGGvq+Yuug"',
    "mtime": "2026-06-02T03:06:05.422Z",
    "size": 287,
    "path": "../public/assets/wallet-vofv3beR.js"
  },
  "/assets/wallets-CdR7-hXn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3cef-CpwkbajaV4vm/eFLIJbJ3X2mCHQ"',
    "mtime": "2026-06-02T03:06:05.417Z",
    "size": 15599,
    "path": "../public/assets/wallets-CdR7-hXn.js"
  },
  "/assets/workflow-bJKUUdqZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-VvXvZNUXLxEkQmLRkk6Tlg7zbnw"',
    "mtime": "2026-06-02T03:06:05.432Z",
    "size": 266,
    "path": "../public/assets/workflow-bJKUUdqZ.js"
  },
  "/assets/zap-Dc9aSC8u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"107-KG+aiWezM2Tyn2aAyDhAPUqtwdI"',
    "mtime": "2026-06-02T03:06:05.420Z",
    "size": 263,
    "path": "../public/assets/zap-Dc9aSC8u.js"
  },
  "/assets/_app-Bpp1epBx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26da-JB5oqBjhiU5LmztSORDlANa4Z9A"',
    "mtime": "2026-06-02T03:06:05.399Z",
    "size": 9946,
    "path": "../public/assets/_app-Bpp1epBx.js"
  },
  "/assets/_id-B2txQSXK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8705-jovy/Q40IoSkc7qoNNxAGvAHKrY"',
    "mtime": "2026-06-02T03:06:05.621Z",
    "size": 34565,
    "path": "../public/assets/_id-B2txQSXK.js"
  },
  "/assets/_slug-BVZfTWHE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"48dd-GQoYhcAHyWh1fOf/l5RiACuRxGc"',
    "mtime": "2026-06-02T03:06:05.406Z",
    "size": 18653,
    "path": "../public/assets/_slug-BVZfTWHE.js"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_FfWtk1 = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_FfWtk1 };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
