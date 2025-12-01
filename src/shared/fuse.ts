import Fuse, { IFuseOptions } from "fuse.js";


export function handleSearch<T>(list:T[],options:IFuseOptions<T>,query:string=""){
    const fuse = new Fuse(list,{
        // isCaseSensitive: false,
        // includeScore: false,
        // ignoreDiacritics: false,
        shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        minMatchCharLength: 1,
        // location: 0,
        threshold: 0.3,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        ...options});
    return fuse.search(query)
}