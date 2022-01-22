#include "toml11/toml.hpp" // that's all! now you can use it.

class EnvRead {
  private:
    auto data;

  public:
    EnvRead (char* filepath) {
      data = toml::parse(filepath);
    }

    template<typename Type>
    Type get (char* property) {
      return toml::find<Type>(data, property);
    }
};
