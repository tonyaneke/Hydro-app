import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 30,
  },
  btn: {
    backgroundColor: "black",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 24,
  },
  btn2: {
    backgroundColor: "red",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 24,
  },
});

export default styles;
