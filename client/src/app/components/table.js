import glamorous from "glamorous";

export default ({ theme: { palette } }) => (
    (view) => glamorous(view)(() => ({
        borderCollapse: 'collapse',
        borderSpacing: 0,
        padding: 20,
        margin: 10,
        '> thead': {
            borderBottom: `1px solid ${palette.borderColor}`
        },
        '& tr': {
        },
        '& td, & th': {
            padding: 10,
        },
        "@media(max-width: 600px)": {
            margin: 0
        },
    }))

)
