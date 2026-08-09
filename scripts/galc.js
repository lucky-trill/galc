const id = "galc";
const sceneDefault = "on";
const absDefault = "on";
const levelDefault = "included";
const navDefault = "visible";
const notifyDefault = false;
const displayDefault = "no-one";
const elevationDefault = "no";
const hudDefault = "right";
const delayDefault = 600;
const preloadDefault = false;

Hooks.once("init", () => {
  game.settings.register(id, 'defaultSB', {
    name: "galc.settings.defaultSB.label",
    hint: "galc.settings.defaultSB.hint",
    localize: true,
    scope: "world",
    config: true,
    default: sceneDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "on": "galc.options.on",
        "off": "galc.options.off"
      },
      required: true
    })
  });
  game.settings.register(id, 'defaultAE', {
    name: "galc.settings.defaultAE.label",
    hint: "galc.settings.defaultAE.hint",
    localize: true,
    scope: "world",
    config: true,
    default: absDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "on": "galc.options.on",
        "off": "galc.options.off"
      },
      required: true
    })
  });
  game.settings.register(id, 'defaultLI', {
    name: "galc.settings.defaultLI.label",
    hint: "galc.settings.defaultLI.hint",
    localize: true,
    scope: "world",
    config: true,
    default: levelDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "included": "galc.options.included",
        "excluded": "galc.options.excluded"
      },
      required: true
    })
  });
  game.settings.register(id, 'defaultLN', {
    name: "galc.settings.defaultLN.label",
    hint: "galc.settings.defaultLN.hint",
    localize: true,
    scope: "world",
    config: true,
    default: navDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "visible": "galc.options.visible",
        "hidden": "galc.options.hidden"
      },
      required: true
    })
  });
  game.settings.register(id, 'notify', {
    name: "galc.settings.notify.label",
    hint: "galc.settings.notify.hint",
    localize: true,
    scope: "world",
    config: true,
    default: notifyDefault,
    requiresReload: false,
    type: new foundry.data.fields.BooleanField()
  });
  game.settings.register(id, 'navDisplay', {
    name: "galc.settings.navDisplay.label",
    hint: "galc.settings.navDisplay.hint",
    localize: true,
    scope: "world",
    config: true,
    default: displayDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "no-one": "galc.options.no-one",
        "players": "galc.options.players",
        "everyone": "galc.options.everyone"
      },
      required: true
    })
  });
  game.settings.register(id, 'navElevation', {
    name: "galc.settings.navElevation.label",
    hint: "galc.settings.navElevation.hint",
    localize: true,
    scope: "world",
    config: true,
    default: elevationDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "no": "galc.options.noElev",
        "gm": "galc.options.gmElev",
        "everyone": "galc.options.everyoneElev"
      },
      required: true
    })
  });
  game.settings.register(id, 'delay', {
    name: "galc.settings.delay.label",
    hint: "galc.settings.delay.hint",
    localize: "true",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 50,
      step: 50,
      max: 6000
    },
    default: delayDefault,
    requiresReload: false
  });
  game.settings.register(id, 'hud', {
    name: "galc.settings.hud.label",
    hint: "galc.settings.hud.hint",
    localize: true,
    scope: "world",
    config: true,
    default: hudDefault,
    requiresReload: true,
    type: new foundry.data.fields.StringField({
      choices: {
        "right": "galc.options.right",
        "left": "galc.options.left",
        "replace": "galc.options.replace",
        "no": "galc.options.no",
      },
      required: true
    })
  });
  game.settings.register(id, 'preload', {
    name: "galc.settings.preload.label",
    hint: "galc.settings.preload.hint",
    localize: true,
    scope: "world",
    config: true,
    default: preloadDefault,
    requiresReload: false,
    type: new foundry.data.fields.BooleanField()
  });
  game.keybindings.register(id, "notify", {
    name: "galc.keybinding.notify.label",
    hint: "galc.keybinding.notify.hint",
    uneditable: [],
    editable: [
      {
        key: "KeyL",
        modifiers: ["Shift"]
      }
    ],
    onDown: () => {
      const token = game.canvas.tokens?.controlled[0]?.document;
      if (token) {
        const scene = game.canvas.scene;
        const user = game.user;
        const level = scene.levels.find(l => l.id === token.level);
        const notification = game.i18n.localize("galc.notifications.notify");
        const name = level.flags[`${id}`]?.navName || level.name;
        ui.notifications.info(notification.replaceAll("{token}", token.name).replaceAll("{level}", name).replaceAll("{elevation}", token.elevation).replaceAll("{units}", scene.grid.units));
      }
    },
    onUp: () => { },
    restricted: false,
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
});

function renderSceneConfig(app, html, context, options) {
  const scene = app.document;
  const fieldset = document.createElement('fieldset');
  fieldset.innerHTML = `<legend class="control"><span>Global Auto Level Change</span></legend>`;
  const defaultSB = game.settings.get(id, 'defaultSB') || sceneDefault;
  const sceneLabel = defaultSB.titleCase();
  const sceneOptions = [
    { value: "default", label: `${game.i18n.localize("galc.options.default")} (${sceneLabel})` },
    { value: "on", label: "galc.options.on" },
    { value: "off", label: "galc.options.off" }
  ];
  const sceneInput = foundry.applications.fields.createSelectInput({
    name: `flags.${id}.behavior`,
    value: scene.getFlag(id, "behavior") || "default",
    options: sceneOptions,
    localize: true
  });
  const sceneGroup = foundry.applications.fields.createFormGroup({
    input: sceneInput,
    label: "galc.settings.scene.label",
    hint: "galc.settings.scene.hint",
    localize: true
  });
  const defaultAE = game.settings.get(id, 'defaultAE') || absDefault;
  const absLabel = defaultAE.titleCase();
  const absOptions = [
    { value: "default", label: `${game.i18n.localize("galc.options.default")} (${absLabel})` },
    { value: "on", label: "galc.options.on" },
    { value: "off", label: "galc.options.off" }
  ];
  const absInput = foundry.applications.fields.createSelectInput({
    name: `flags.${id}.abs`,
    value: scene.getFlag(id, "abs") || "default",
    options: absOptions,
    localize: true
  });
  const absGroup = foundry.applications.fields.createFormGroup({
    input: absInput,
    label: "galc.settings.abs.label",
    hint: "galc.settings.abs.hint",
    localize: true
  });
  const basicOptions = html.querySelector(".tab[data-group=\"sheet\"][data-tab=\"levels\"]");
  fieldset.append(sceneGroup);
  fieldset.append(absGroup);
  basicOptions.append(fieldset);
  app.setPosition();
};

Hooks.on("renderSceneConfig", renderSceneConfig);

Hooks.on("updateScene", async (scene, change, options) => {
  if (scene && change?.flags[`${id}`]?.abs) {
    await canvas.draw();
  }
});

function renderLevelConfig(app, html, context, options) {
  const level = app.document;
  const fieldset = document.createElement('fieldset');
  fieldset.innerHTML = `<legend class="control"><span>Global Auto Level Change</span></legend>`;
  const defaultLI = game.settings.get(id, 'defaultLI') || levelDefault;
  const levelLabel = defaultLI.titleCase();
  const levelOptions = [
    { value: "default", label: `${game.i18n.localize("galc.options.default")} (${levelLabel})` },
    { value: "included", label: "galc.options.included" },
    { value: "excluded", label: "galc.options.excluded" }
  ];
  const levelInput = foundry.applications.fields.createSelectInput({
    name: `flags.${id}.inclusion`,
    value: level.getFlag(id, "inclusion") || "default",
    options: levelOptions,
    localize: true
  });
  const levelGroup = foundry.applications.fields.createFormGroup({
    input: levelInput,
    label: "galc.settings.level.label",
    hint: "galc.settings.level.hint",
    localize: true
  });
  const defaultLN = game.settings.get(id, 'defaultLN') || navDefault;
  const navLabel = defaultLN.titleCase();
  const navOptions = [
    { value: "default", label: `${game.i18n.localize("galc.options.default")} (${navLabel})` },
    { value: "visible", label: "galc.options.visible" },
    { value: "hidden", label: "galc.options.hidden" }
  ];
  const navInput = foundry.applications.fields.createSelectInput({
    name: `flags.${id}.nav`,
    value: level.getFlag(id, "nav") || "default",
    options: navOptions,
    localize: true
  });
  const navGroup = foundry.applications.fields.createFormGroup({
    input: navInput,
    label: "galc.settings.nav.label",
    hint: "galc.settings.nav.hint",
    localize: true
  });
  const navNameInput = foundry.applications.fields.createTextInput({
    name: `flags.${id}.navName`,
    value: level.getFlag(id, "navName") || ""
  });
  const navNameGroup = foundry.applications.fields.createFormGroup({
    input: navNameInput,
    label: "galc.settings.navName.label",
    hint: "galc.settings.navName.hint",
    localize: true
  });
  const groupInput = foundry.applications.fields.createTextInput({
    name: `flags.${id}.group`,
    value: level.getFlag(id, "group") || ""
  });
  const groupGroup = foundry.applications.fields.createFormGroup({
    input: groupInput,
    label: "galc.settings.group.label",
    hint: "galc.settings.group.hint",
    localize: true
  });
  const basicOptions = html.querySelector(".standard-form[data-application-part=\"body\"]");
  fieldset.append(levelGroup);
  fieldset.append(navGroup);
  fieldset.append(navNameGroup);
  fieldset.append(groupGroup);
  basicOptions.append(fieldset);
  app.setPosition();
};

Hooks.on("renderLevelConfig", renderLevelConfig);

Hooks.on("updateToken", async (token, change, options, userId) => {
  const user = game.user;
  if (user.id === userId && !isNaN(token?.elevation) && !isNaN(change?.elevation) && !change?.level) {
    const defaultSB = game.settings.get(id, 'defaultSB') || sceneDefault;
    const scene = token.parent;
    const flag = scene.flags[`${id}`]?.behavior || defaultSB;
    if (flag === "on" || (flag === "default" && defaultSB === "on")) {
      const defaultLI = game.settings.get(id, 'defaultLI') || levelDefault;
      const level = scene.levels.find(l => l.id === token.level);
      if (change.elevation < level.elevation.bottom || change.elevation >= level.elevation.top) {
        const group = level.flags[`${id}`]?.group;
        const levels = scene.levels.filter(l => (((!group || group === "") && (!l.flags[`${id}`]?.group || l.flags[`${id}`]?.group === "")) || (l.flags[`${id}`]?.group === group)) && ((l.flags[`${id}`]?.inclusion || defaultLI) === "included" || (l.flags[`${id}`]?.inclusion === "default" && defaultLI === "included")));
        if (levels.length > 1) {
          let newLevel = levels.find(l => change.elevation >= l.elevation.bottom && change.elevation < l.elevation.top);
          if (!newLevel && change.elevation < level.elevation.bottom) {
            newLevel = levels.sort((a, b) => parseFloat(a.elevation.bottom) - parseFloat(b.elevation.bottom))[0];
          } else if (!newLevel && change.elevation > level.elevation.top) {
            newLevel = levels.sort((a, b) => parseFloat(b.elevation.top) - parseFloat(a.elevation.top))[0];
          }
          if (newLevel && newLevel?.id !== level?.id) {
            const ids = canvas.tokens?.controlled?.map(c => c.document.id);
            await new Promise(r => setTimeout(r, 100));
            await token.update({ "level": newLevel.id });
            if (ids[0] === token.id) {
              if (game.settings.get(id, 'notify') || notifyDefault) {
                const notification = game.i18n.localize("galc.notifications.change");
                const name = newLevel.flags[`${id}`]?.navName || newLevel.name;
                ui.notifications.info(notification.replaceAll("{token}", token.name).replaceAll("{level}", name).replaceAll("{elevation}", change.elevation).replaceAll("{units}", scene.grid.units));
              }
              const observe = scene.tokens.filter(t => t.id !== token.id && t.testUserPermission(user, "OBSERVER"));
              if (user.viewedLevel !== newLevel.id) {
                if (user.isGM || (ids.length < 2 && observe?.length > 0 && observe.filter(t => t.level == newLevel.id)?.length < 1 && observe.filter(t => t.level == level?.id)?.length > 0)) {
                  await scene.view({ "level": newLevel.id });
                } else {
                  const delay = game.settings.get(id, 'delay') || delayDefault;
                  await new Promise(r => setTimeout(r, delay));
                }
                await canvas.tokens.releaseAll();
                ids.forEach(async (i) => {
                  await scene.tokens.find(t => t.id === i)?.object?.control({ releaseOthers: false });
                });
              }
            }
          }
        }
      }
    }
  }
});

Hooks.on('renderTokenHUD', async (app, html, context) => {
  if (!canvas.tokens.controlled) {
    return;
  } else {
    const token = canvas.tokens.controlled[canvas.tokens.controlled.length - 1]?.document;
    if (!token) {
      return;
    } else {
      const placement = game.settings.get(id, 'hud') || hudDefault;
      if (placement !== "no") {
        const side = (placement === "replace") ? "left" : placement;
        const column = html.querySelector(`div.col.${side}`);
        const newDiv = document.createElement('div');
        newDiv.classList.add("attribute");
        newDiv.classList.add("elevation");
        newDiv.setAttribute('data-tooltip', '');
        newDiv.setAttribute('aria-label', game.i18n.localize("galc.hud.label"));
        newDiv.innerHTML = `<i class="caret fa-solid fa-arrows-up-to-line" inert></i><input type="text" name="absolute-elevation" value="${isNaN(token.elevation) ? "??" : token.elevation}">`;
        const elem = newDiv.querySelector('input[name="absolute-elevation"]');
        elem.addEventListener('change', async (event) => {
          const value = elem?.value?.trim();
          const parsed = parseFloat(value);
          const newElevation = (value.startsWith("-") || value.startsWith("+")) ? token.elevation + parsed : parsed;
          if (!isNaN(newElevation) && newElevation !== token.elevation) {
            const origin = token._source;
            const destination = token.object._getHUDMovementPosition(newElevation);
            destination.x = Math.round(destination.x ?? origin.x);
            destination.y = Math.round(destination.y ?? origin.y);
            destination.elevation ??= origin.elevation;
            destination.width ??= origin.width;
            destination.height ??= origin.height;
            destination.shape ??= origin.shape;
            destination.action = token.object._getHUDMovementAction();
            if (canvas.grid.isGridless) {
              destination.snapped = false;
            } else {
              const snappedOrigin = token.getSnappedPosition(origin);
              const snappedDestination = token.getSnappedPosition(destination);
              destination.snapped = (origin.x === Math.round(snappedOrigin.x))
                && (origin.y === Math.round(snappedOrigin.y))
                && (origin.elevation.almostEqual(snappedOrigin.elevation))
                && (destination.x === Math.round(snappedDestination.x))
                && (destination.y === Math.round(snappedDestination.y))
                && (destination.elevation.almostEqual(snappedDestination.elevation));
            }
            destination.explicit = false;
            destination.checkpoint = true;
            const unconstrainedMovement = game.user.isGM && game.settings.get("core", "unconstrainedMovement");
            const constrainOptions = { ignoreWalls: unconstrainedMovement, ignoreCost: unconstrainedMovement };
            await token.move(destination, { method: "hud", constrainOptions, animate: false });
          }
        });
        column.insertBefore(newDiv, column.firstChild);
        if (placement === "replace") {
          const removal = column.querySelector('.elevation input[name="elevation"]').parentNode;
          removal.parentNode.removeChild(removal);
        }
      }
    }
  }
});

function absoluteElevation(token) {
  const doc = token.document;
  const defaultAE = game.settings.get(id, 'defaultAE') || absDefault;
  const flag = doc.parent.flags[`${id}`]?.abs || defaultAE;
  if (flag === "on" || (flag === "default" && defaultAE === "on")) {
    const elev = Math.round(doc.elevation);
    if (!isNaN(elev)) {
      const sign = (Math.abs(elev) === elev) ? "+" : "";
      const unit = doc.parent.grid.units;
      token.tooltip.text = (elev === 0) ? "" : `${sign}${elev} ${unit}`;
    }
  }
};

Hooks.on("drawToken", absoluteElevation);
Hooks.on("refreshToken", absoluteElevation);

Hooks.on('renderSceneNavigation', (app, html, options) => {
  function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }
  const ndSetting = game.settings.get(id, 'navDisplay') || displayDefault;
  if (ndSetting === "everyone" || (ndSetting !== "no-one" && !game.user.isGM)) {
    const defaultNav = html.querySelector("#scene-navigation-levels");
    const scene = game.canvas.scene;
    const levels = scene?.levels?.filter(l => l).sort((a, b) => b.index - a.index);
    if (levels?.length > 1) {
      if (defaultNav) {
        defaultNav.parentNode.removeChild(defaultNav);
      }
      const levelsNav = document.createElement('menu');
      levelsNav.setAttribute("id", "scene-navigation-levels");
      levelsNav.classList.add("scene-levels");
      levelsNav.classList.add("scene-navigation-menu");
      levelsNav.classList.add("galc-scene-levels");
      levelsNav.classList.add("flexcol");
      levelsNav.style.setProperty('--max-levels', levels.length);
      let levelsStr = ``;
      const user = game.user;
      levels.forEach(l => {
        const defaultLN = game.settings.get(id, 'defaultLN') || navDefault;
        const flag = l.flags[`${id}`]?.nav || defaultLN;
        const users = game.users.filter(u => u.active && u.viewedLevel === l.id && u.viewedScene === l.parent.id);
        if (user.isGM || flag === "visible" || (flag === "default" && defaultLN === "visible") || users.map(u => u.id).includes(user.id) || scene.tokens.filter(t => t.level === l.id && t.testUserPermission(user, "OBSERVER"))?.length > 0) {
          let players = users.length > 0 ? `<ul class="scene-players">` : ``;
          if (users.length > 0) {
            users.forEach(u => {
              players += `<li class="scene-player" style="--color-bg: ${shadeColor(u.color.css, -50)}; --color-border: ${u.color.css}" data-tooltip="" aria-label="${u.name}">${Array.from(u.name)[0]}</li>`;
            })
          }
          players += users.length > 0 ? `</ul>` : ``;
          const view = (game.user.viewedLevel === l.id) ? `view` : ``;
          const name = l.flags[`${id}`]?.navName || l.name;
          const ariaLabel = (user.isGM && l.name !== name) ? ` data-tooltip="" aria-label="${l.name}"` : "";
          const elevSetting = game.settings.get(id, 'navElevation') || elevationDefault;
          const elevation = (elevSetting === "everyone" || (elevSetting === "gm" && game.user.isGM)) ? ` [${l.elevation.bottom}, ${l.elevation.top}]`.replaceAll("Infinity", "∞") : "";
          levelsStr += `<li class="level-row">
            <div class="ui-control scene scene-level ${view}" data-scene-id="${l.parent.id}" data-level-id="${l.id}" data-action="viewLevel"${ariaLabel}>
                <span class="ellipsis">${name}${elevation}</span>${players}
            </div>
          </li>`;
        }
      })
      levelsNav.innerHTML = levelsStr;
      html.insertBefore(levelsNav, html.querySelector("#scene-navigation-viewed").nextSibling);
    }
  }
});

Hooks.on("canvasReady", () => {
  const scene = canvas.scene;
  if (scene?.active && (game.settings.get(id, 'preload') || preloadDefault)) {
    const level = scene.levels.find(l => l.id === game.user.viewedLevel);
    const group = level.flags[`${id}`]?.group;
    const levels = scene.levels.filter(l => ((!group || group === "") && (!l.flags[`${id}`]?.group || l.flags[`${id}`]?.group === "")) || l.flags[`${id}`]?.group === group);
    if (levels?.length > 1) {
      const sortBottom = levels.sort((a, b) => parseFloat(a.elevation.bottom) - parseFloat(b.elevation.bottom));
      const sortTop = levels.sort((a, b) => parseFloat(a.elevation.top) - parseFloat(b.elevation.top));
      const indexBottom = sortBottom.findIndex(l => l.id === level.id);
      const indexTop = sortTop.findIndex(l => l.id === level.id);
      const lower = sortBottom[indexBottom - 1]
      const upper = sortTop[indexTop + 1];
      if (lower) {
        game.scenes.preload(scene.id, { level: lower.id, broadcast: false });
      }
      if (upper) {
        game.scenes.preload(scene.id, { level: upper.id, broadcast: false });
      }
    }
  }
});
