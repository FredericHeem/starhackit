
import glamorous from "glamorous-native";

export default ({theme}) =>
  glamorous.text({
    fontSize: 16,
    color: theme.textPrimary,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  }, props => ({
    
    color: props.primary && theme.textPrimaryOnPrimary
  }))
