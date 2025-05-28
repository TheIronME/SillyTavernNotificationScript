import json

# .env 中填入绑定的域名 一行一个  最后一行留空


def output_st_helper_script():
    with open("src\【酒馆助手】通知助手.js", "r", encoding="utf-8") as f:
        js_code = f.read()
    json_dict = {
        "id": "2d7b624b-cbbd-4cb8-ac36-c63621ded94e",
        "name": "通知助手",
        "content": "",
        "info": "",
        "buttons": [],
    }
    json_dict["content"] = js_code

    json_data = json.dumps(json_dict, ensure_ascii=False, indent=4)

    with open("【酒馆助手】通知助手.json", "w", encoding="utf-8") as f:
        f.write(json_data)


def output_tm_script():
    with open("src\【油猴脚本】通知助手.js", "r", encoding="utf-8") as f:
        tm_js_code = f.readlines()
    with open(".env", "r", encoding="utf-8") as f:
        domins = f.readlines()
    new_tm_js_code = []
    for index, i in enumerate(tm_js_code):
        if "// @match" in i and index < 10:
            for j in domins:
                new_tm_js_code.append("// @match  " + j)
        else:
            new_tm_js_code.append(i)
    with open("【油猴脚本】通知助手-自用.js", "w", encoding="utf-8") as f:
        f.writelines(new_tm_js_code)
    with open("【油猴脚本】通知助手.js", "w", encoding="utf-8") as f:
        f.writelines(tm_js_code)

if __name__ == "__main__":
    output_st_helper_script()
    output_tm_script()
