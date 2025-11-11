import { useState, useEffect } from "react";
import { X, LoaderCircle } from "lucide-react";
import styles from "./PopupSend.module.scss";

type popupType = {
  prop: boolean;
  setProp: React.Dispatch<React.SetStateAction<boolean>>;
};

function PopupSend({ setProp }: popupType) {
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  // const [File, setFile] = useState("File");
  const [phoneVal, setphoneVal] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [checkVal, setCheckVal] = useState(false);

  const backendUrl = "/send-email";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  type EmailFormType = {
    name: string;
    email: string;
    phone: string;
    about: string;
  };

  const dataFormObject: EmailFormType = {
    name: name,
    email: email,
    phone: phoneVal.replace(/\D/g, ""),
    about: about,
  };

  async function dataFormRequest() {
    const allField = Object.values(dataFormObject).every(
      (value) => value.trim() !== ""
    );
    if (!allField) {
      console.error("Заполните все поля", 422);
      setStatus(422);
      return;
    }
    try {
      setStatus(100);
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataFormObject),
      });
      if (!response.ok) {
        setStatus(response.status);
        return;
      } else {
        console.log(response);
      }

      const data = await response.json();
      console.log(data);
      setStatus(201);
    } catch (erorr) {
      console.error(erorr);
    }
  }

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, "").substring(0, 11);
    const part1 = nums.substring(0, 1);
    const part2 = nums.substring(1, 4);
    const part3 = nums.substring(4, 7);
    const part4 = nums.substring(7, 9);
    const part5 = nums.substring(9, 11);

    let formatted = "+";
    if (part1) formatted += part1;
    if (part2) formatted += ` (${part2})`;
    if (part3) formatted += ` ${part3}`;
    if (part4) formatted += `-${part4}`;
    if (part5) formatted += `-${part5}`;

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = e.target.value.replace(/\D/g, "");
    setphoneVal(formatPhone(nums));
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setProp(false);
      setClosing(false);
    }, 300);
  };

  return (
    <div
      className={`${styles.app_popupSend} ${
        closing ? styles.hide : styles.fadeOut
      }`}
    >
      {status == null ? (
        <div className={styles.popupSend_content}>
          <div className={styles.content_textCon}>
            <div className={styles.textCon_top}>
              <h1 className={styles.top_main}>Написать нам</h1>
              <X className={styles.top_svg} size="34px" onClick={handleClose} />
            </div>
            <span className={styles.textCon_disc}>
              Оставьте контакты, чтобы могли обсудить проект и условия
              сотрудничества
            </span>
          </div>
          <div
            className={`${styles.content_inputCon}  ${
              status == 422 ? styles.success : ""
            }`}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputCon_input}
              placeholder="Имя и организация"
            />
            <div className={styles.inputCon_flex}>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputCon_input}
                placeholder="Email"
              />
              <input
                value={phoneVal}
                onChange={handlePhoneChange}
                type="text"
                className={styles.inputCon_inputPhone}
                placeholder="+7 (555) 555-55-55"
              />
            </div>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className={styles.inputCon_textArea}
              placeholder="Расскажите о проекте"
            />
          </div>
          <div className={styles.content_buttons}>
            <label className={styles.buttons_fileCon}>
              <img src="images/file.svg" className={styles.fileCon_img} />
              <span className={styles.fileCon_text}>
                Прикрепить файл до 10 Мб
              </span>
              <input type="file" className={styles.fileCon_input} />
            </label>
            <div className={styles.buttons_selectbox}>
              <label className={styles.selectbox_custom}>
                <input
                  type="checkbox"
                  className={styles.custom_input}
                  checked={checkVal}
                  onChange={(e) => setCheckVal(e.target.checked)}
                />
                <span className={styles.custom_span}></span>
              </label>
              <a className={styles.selectbox_text}>
                Я согласен(а) на обработку персональных данных
              </a>
            </div>
            <button
              className={styles.buttons_btn}
              onClick={() => {
                if (checkVal) {
                  dataFormRequest();
                }
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      ) : status == 201 ? (
        <div className={styles.popupSend_success}>
          <X className={styles.success_svg} size="34px" onClick={handleClose} />
          <img
            src="images/Success.svg"
            className={styles.success_img}
            loading="lazy"
          />
          <span className={styles.success_main}>
            Спасибо! Ваша заявка отправлена
          </span>
          <span className={styles.success_text}>
            Мы свяжемся с вами в рабочее время
          </span>
        </div>
      ) : status == 100 ? (
        <div className={styles.popupSend_loading}>
          <LoaderCircle className={styles.loading_success} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default PopupSend;
