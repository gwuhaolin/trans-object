/**
 * 对obj做转换的工具函数
 */
class TransObject {
  private value: object = {};

  constructor(obj: object) {
    this.value = Object.assign({}, obj);
  }

  /**
   * 把obj中字段中的值为数组的改成字符串，以方便通过GET请求发送给后端服务
   */
  arr2str(): TransObject {
    Object.keys(this.value).forEach(key => {
      const val = this.value[key];
      this.value[key] = Array.isArray(val) ? JSON.stringify(val) : val;
    });
    return this;
  }

  /**
   * 删除部分字段
   */
  deleteFields(...fields: string[]): TransObject {
    fields.forEach(field => {
      delete this.value[field];
    });
    return this;
  }

  /**
   * 删除所有空字段，包括值为："",[],null,undefined
   */
  deleteEmptyFields(...ignoreFields: string[]): TransObject {
    Object.keys(this.value).forEach(field => {
      if (ignoreFields.includes(field)) {
        return;
      }
      const val = this.value[field];
      if (
        val === "" ||
        (Array.isArray(val) && val.length === 0) ||
        val == null
      ) {
        delete this.value[field];
      }
    });
    return this;
  }

  /**
   * 展开部分字段到最外层
   */
  unfoldFields(...fields: string[]): TransObject {
    fields.forEach(field => {
      const unfoldVal = this.value[field];
      delete this.value[field];
      Object.assign(this.value, unfoldVal);
    });
    return this;
  }

  /**
   * 只取其中部分字段
   */
  pickFields(...fields: string[]): TransObject {
    Object.keys(this.value).forEach(field => {
      if (!fields.includes(field)) {
        delete this.value[field];
      }
    });
    return this;
  }

  /**
   * 改变字段的名称
   */
  renameFields(fieldsNameMap: { [oldName: string]: string }): TransObject {
    Object.keys(fieldsNameMap).forEach(oldName => {
      const newName = fieldsNameMap[oldName];
      this.value[newName] = this.value[oldName];
      delete this.value[oldName];
    });
    return this;
  }

  /**
   * 合并额外的obj
   */
  merge(...objs: Array<TransObject | object>): TransObject {
    objs.forEach(obj => {
      if (obj instanceof TransObject) {
        Object.assign(this.value, obj.value);
      } else {
        Object.assign(this.value, obj);
      }
    });
    return this;
  }

  clone() {
    return new TransObject(this.value);
  }

  done() {
    return this.value;
  }
}

export default function transObject(obj: object) {
  return new TransObject(obj);
}
