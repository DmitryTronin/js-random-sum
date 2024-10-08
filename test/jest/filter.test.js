describe("Filter function", () => {
    const input = [
        {id: 1, url: "https://www.url1.dev"},
        {id: 2, url: "https://www.url2.dev"},
        {id: 3, url: "https://www.link3.dev"}
    ];

    test("it should filter by a search term (link)", () => {
        const output = [{id: 3, url: "https://www.link3.dev"}];

        expect(filterByTerm(input, "link")).toEqual(output);

        expect(filterByTerm(input, "LINK")).toEqual(output);
    });

    test("it should filter by a search term (url)", () => {

        const output = [{id: 1, url: "https://www.url1.dev"}, {id: 2, url: "https://www.url2.dev"}];

        expect(filterByTerm(input, "u1RL")).toEqual(output);
    });

    test("it should filter by an empty search term", () => {
        const output = [
            {id: 1, url: "https://www.url1.dev"},
            {id: 2, url: "https://www.url2.dev"},
            {id: 3, url: "https://www.link3.dev"}
        ];
        expect(filterByTerm(input, "")).toEqual(output);
    });

    test("it should not filter by an invalid search term", () => {
        const output = [];
        expect(filterByTerm(input, "invalid")).toEqual(output);
    });
});

function filterByTerm(inputArr, searchTerm) {
    const regex = new RegExp(searchTerm, "i");
    return inputArr.filter(function (arrayElement) {
        return arrayElement.url.match(regex);
    });
}