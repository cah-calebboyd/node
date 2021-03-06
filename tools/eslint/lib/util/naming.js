/**
 * @fileoverview Common helpers for naming of plugins, formatters and configs
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const pathUtil = require("../util/path-util");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const NAMESPACE_REGEX = /^@.*\//i;

/**
 * Brings package name to correct format based on prefix
 * @param {string} name The name of the package.
 * @param {string} prefix Can be either "eslint-plugin", "eslint-config" or "eslint-formatter"
 * @returns {string} Normalized name of the package
 * @private
 */
function normalizePackageName(name, prefix) {

    /**
     * On Windows, name can come in with Windows slashes instead of Unix slashes.
     * Normalize to Unix first to avoid errors later on.
     * https://github.com/eslint/eslint/issues/5644
     */
    if (name.indexOf("\\") > -1) {
        name = pathUtil.convertPathToPosix(name);
    }

    if (name.charAt(0) === "@") {

        /**
         * it's a scoped package
         * package name is the prefix, or just a username
         */
        const scopedPackageShortcutRegex = new RegExp(`^(@[^/]+)(?:/(?:${prefix})?)?$`),
            scopedPackageNameRegex = new RegExp(`^${prefix}(-|$)`);

        if (scopedPackageShortcutRegex.test(name)) {
            name = name.replace(scopedPackageShortcutRegex, `$1/${prefix}`);
        } else if (!scopedPackageNameRegex.test(name.split("/")[1])) {

            /**
             * for scoped packages, insert the prefix after the first / unless
             * the path is already @scope/eslint or @scope/eslint-xxx-yyy
             */
            name = name.replace(/^@([^/]+)\/(.*)$/, `@$1/${prefix}-$2`);
        }
    } else if (name.indexOf(`${prefix}-`) !== 0) {
        name = `${prefix}-${name}`;
    }

    return name;
}

/**
 * Removes the prefix from a term.
 * @param {string} prefix The prefix to remove.
 * @param {string} term The term which may have the prefix.
 * @returns {string} The term without prefix.
 */
function removePrefixFromTerm(prefix, term) {
    return term.startsWith(prefix) ? term.slice(prefix.length) : term;
}

/**
 * Adds a prefix to a term.
 * @param {string} prefix The prefix to add.
 * @param {string} term The term which may not have the prefix.
 * @returns {string} The term with prefix.
 */
function addPrefixToTerm(prefix, term) {
    return term.startsWith(prefix) ? term : `${prefix}${term}`;
}

/**
 * Gets the scope (namespace) of a term.
 * @param {string} term The term which may have the namespace.
 * @returns {string} The namepace of the term if it has one.
 */
function getNamespaceFromTerm(term) {
    const match = term.match(NAMESPACE_REGEX);

    return match ? match[0] : "";
}

/**
 * Removes the namespace from a term.
 * @param {string} term The term which may have the namespace.
 * @returns {string} The name of the plugin without the namespace.
 */
function removeNamespaceFromTerm(term) {
    return term.replace(NAMESPACE_REGEX, "");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    normalizePackageName,
    removePrefixFromTerm,
    addPrefixToTerm,
    getNamespaceFromTerm,
    removeNamespaceFromTerm
};
