import { konosuba } from "./module/config.js";
import RaceSheet from "./module/sheets/Items/RaceSheet.js";
import CharacterSheet from "./module/sheets/Actors/CharacterSheet.js";

async function loadHandleBarTemplates() {
    // register templates parts
    const templatePaths = [
        "systems/konosuba/templates/sheets/parts/character-header.hbs",
        "systems/konosuba/templates/sheets/parts/character-attributes.hbs",
        "systems/konosuba/templates/sheets/parts/character-equipment.hbs",
        "systems/konosuba/templates/sheets/parts/character-belongings.hbs",
        "systems/konosuba/templates/sheets/parts/character-skills.hbs",
        "systems/konosuba/templates/sheets/parts/character-combat.hbs",
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("Konosuba | Initializing...");

    loadHandleBarTemplates();

    CONFIG.konosuba = konosuba;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("konosuba", RaceSheet, {
        types: ["race"],
        makeDefault: true,
        label: "konosuba.sheets.race",
    });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("konosuba", CharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "konosuba.sheets.race",
    });

    Handlebars.registerHelper("ability", function (abilityString) {
        abilityString = abilityString.toLowerCase();
        return "konosuba.abilities."+abilityString;
    });
});
