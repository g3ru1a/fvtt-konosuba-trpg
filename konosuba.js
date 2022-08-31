import KonosubaItemSheet from "./module/sheets/KonosubaItemSheet.js";
import { konosuba } from "./module/config.js";
import KonosubaCharacterSheet from "./module/sheets/KonosubaCharacterSheet.js";


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

Hooks.once("init", function() {
    console.log('Konosuba | Initializing...');

    loadHandleBarTemplates();

    CONFIG.konosuba = konosuba;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("konosuba", KonosubaItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("konosuba", KonosubaCharacterSheet, { makeDefault: true });
});