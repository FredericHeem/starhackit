import glamorous from 'glamorous';

export default function({theme}){
  const {palette} = theme;
  const Panel = glamorous.div({
    borderBottom: `1px solid ${palette.accent2Color}`,
    padding: '0.5rem',
  });

  const Header = glamorous.div({
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '0.5rem',
    backgroundColor: palette.accent3Color
  });

  const Body = glamorous.div({
    padding: '0.5rem',
    backgroundColor: palette.accent2Color
  });

  return {
    Panel,
    Header,
    Body
  }
}
