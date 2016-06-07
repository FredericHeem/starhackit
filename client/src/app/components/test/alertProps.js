export default function () {
    return [
        {
            name: 'All props',
            props: {
                title: 'My Title',
                name: "My name",
                message: "My message"
            }
        },
        {
            name: 'no props',
            props: {
            }
        },
        {
            name: 'Only title',
            props: {
                title: 'My Title'
            }
        }
    ]
}
