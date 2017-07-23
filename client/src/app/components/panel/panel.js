import glamorous from 'glamorous';

export default function({theme}){
  const {palette} = theme;
  const Panel = glamorous('div')({
    borderBottom: `1px solid ${palette.primaryDark}`,
    padding: '0.5rem',
  });

  const Header = glamorous('div')({
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '0.5rem',
    backgroundColor: palette.primaryLight
  });

  const Body = glamorous('div')({
    padding: '0.5rem',
    backgroundColor: palette.background
  });

  return {
    Panel,
    Header,
    Body
  }
}
