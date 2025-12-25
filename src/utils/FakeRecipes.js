export function FakeRecipes(ingredients){
    return[
        {
            id:1,
            title: `${ingredients[0] || "simple"} Delight`,
            time : "15 mins",
            difficulty : "Easy",
            description : `a quick recipe using ${ingredients.join(",")}.`,
        },
        {
            id:2,
            title: `${ingredients[1] || "Homestyle"} Delight`,
            time : "15 mins",
            difficulty : "Easy",
            description : `a quick recipe using ${ingredients.join(",")}.`,
        },
        {
            id:1,
            title: "Creative Mix Bowl",
            time : "30 mins",
            difficulty : "Medium",
            description : `An experimental recipe combining ${ingredients.join(", ")}.`,
        },
    ]
}