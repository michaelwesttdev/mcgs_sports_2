export function getGenderName(gender:"male"|"female"|"mixed"){
    return gender === "male"?"Boys":gender==="female"?"Girls":"Mixed"
}