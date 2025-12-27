export function FakeRecipes(ingredients){
    return[
        {
            id:1,
            title: "Parmesaan Garlic Delight",
            time : "15 mins",
            difficulty : "Easy",
            description : `a quick recipe using ${ingredients.join(",")}.`,
        },
        {
            id:2,
            title: "Lemon Corainder Potato",
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