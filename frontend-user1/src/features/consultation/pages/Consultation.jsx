import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  clearConsultationError,
  createConsultation,
} from "../consultationSlice";
import { useToast } from "../../../components/ui/toastContext";

const inputClass = `
  h-[50px]
  w-full
  rounded-[11px]
  border
  border-[#e5dac6]
  bg-[#fffdf9]
  px-4
  text-[14px]
  text-[#17130f]
  outline-none
  transition-all
  placeholder:text-[#9c9387]
  hover:border-[#d5c4a7]
  focus:border-[#d6a13b]
  focus:ring-4
  focus:ring-[#d6a13b]/10
`;

const initialFormData = {
  fullName: "",
  age: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  timeOfBirth: "",
  message: "",
};

const Consultation = () => {
  const dispatch = useDispatch();
  const { isSubmitting, error } = useSelector((state) => state.consultation);
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearConsultationError());
    }
  }, [dispatch, error, showToast]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      createConsultation({ ...formData, age: Number(formData.age) }),
    );

    if (createConsultation.fulfilled.match(result)) {
      setSubmitted(true);
      setFormData(initialFormData);
      showToast("Consultation request submitted successfully.");
    }
  };

  return (
    <section className="min-h-screen bg-[#faf3e4] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1050px]">
        {/* Header */}
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#a1782f]">
            PERSONAL GUIDANCE
          </p>

          <h1 className="mt-3 font-serif text-[44px] leading-tight text-[#2b241d] sm:text-[56px]">
            Book a Consultation
          </h1>

          <p className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-[#75695c] sm:text-[16px]">
            Share a few details about yourself and what you are looking for. Our
            expert will review your request and connect with you.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto mt-12 max-w-[820px] rounded-[22px] border border-[#e4d5b8] bg-[#fffdf9] p-6 shadow-[0_18px_50px_rgba(55,42,25,0.08)] sm:p-9 md:p-10">
          {/* Card Header */}
          <div className="mb-8 border-b border-[#eee2cd] pb-6">
            <h2 className="font-serif text-[30px] text-[#2b241d]">
              Tell us about yourself
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-[#75695c]">
              Please provide accurate details so our expert can understand your
              requirements better.
            </p>
          </div>

          {submitted ? (
            /* Success Message */
            <div className="rounded-[15px] border border-[#d8dfc7] bg-[#f5f7ee] px-6 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4e9d4]">
                <span className="text-[25px] text-[#657442]">✓</span>
              </div>

              <h3 className="mt-5 font-serif text-[29px] text-[#2b241d]">
                Consultation request received
              </h3>

              <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-6 text-[#75695c]">
                Thank you for sharing your details. Our team will review your
                request and connect with you shortly.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="
                  mt-6
                  rounded-[10px]
                  border
                  border-[#dfcfb0]
                  bg-[#fffdf9]
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  text-[#2b241d]
                  transition
                  hover:bg-[#faf3e4]
                "
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Age */}
              <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
                {/* Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]"
                    />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      autoComplete="tel"
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* Date + Time of Birth */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Date of birth
                  </label>

                  <div className="relative">
                    <Calendar
                      size={17}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]"
                    />

                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                {/* Time of Birth */}
                <div>
                  <label
                    htmlFor="timeOfBirth"
                    className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                  >
                    Time of birth
                  </label>

                  <div className="relative">
                    <Clock
                      size={17}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]"
                    />

                    <input
                      id="timeOfBirth"
                      name="timeOfBirth"
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-[14px] font-semibold text-[#17130f]"
                >
                  What would you like guidance about?
                </label>

                <div className="relative">
                  <MessageSquare
                    size={17}
                    strokeWidth={1.7}
                    className="absolute left-4 top-4 text-[#8d8172]"
                  />

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us briefly about your concern or what you would like guidance on..."
                    rows={6}
                    required
                    className="
                      min-h-[145px]
                      w-full
                      resize-none
                      rounded-[11px]
                      border
                      border-[#e5dac6]
                      bg-[#fffdf9]
                      px-4
                      py-3.5
                      pl-11
                      text-[14px]
                      leading-6
                      text-[#17130f]
                      outline-none
                      transition-all
                      placeholder:text-[#9c9387]
                      hover:border-[#d5c4a7]
                      focus:border-[#d6a13b]
                      focus:ring-4
                      focus:ring-[#d6a13b]/10
                    "
                  />
                </div>
              </div>

              {/* Privacy Note */}
              <div className="rounded-[11px] border border-[#eee2cd] bg-[#faf5eb] px-4 py-3.5">
                <p className="text-[12px] leading-5 text-[#75695c]">
                  Your information will be kept private and will only be used to
                  understand your consultation request and contact you regarding
                  your appointment.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  h-[53px]
                  w-full
                  rounded-[11px]
                  bg-[#e2ad38]
                  px-5
                  text-[14px]
                  font-semibold
                  text-[#17130f]
                  shadow-[0_8px_20px_rgba(190,145,50,0.18)]
                  transition-all
                  hover:bg-[#d9a22e]
                  hover:shadow-[0_10px_24px_rgba(190,145,50,0.24)]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting
                  ? "Submitting request..."
                  : "Request a Consultation"}
              </button>

              <p className="text-center text-[11px] text-[#8b7e70]">
                Our team will contact you after reviewing your request.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Consultation;
