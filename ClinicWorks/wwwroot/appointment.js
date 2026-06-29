(() => {
    const initializeAppointmentForm = () => {
        const form = document.querySelector(".appointment-form");
        const modal = document.querySelector("#appointment-success-modal");
        const status = document.querySelector("#appointment-form-status");

        if (!form || form.dataset.staticFormsBound === "true") return;
        form.dataset.staticFormsBound = "true";

        const setFormStatus = (type, message) => {
            if (!status) return;
            status.classList.remove("success", "error");
            if (type) status.classList.add(type);
            status.textContent = message || "";
        };

        const openSuccessModal = () => {
            if (!modal) return;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            modal.querySelector(".appointment-success-close")?.focus();
        };

        const closeSuccessModal = () => {
            if (!modal) return;
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        modal?.querySelectorAll(".appointment-success-close").forEach(button => {
            button.addEventListener("click", closeSuccessModal);
        });
        modal?.addEventListener("click", event => {
            if (event.target === modal) closeSuccessModal();
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modal?.classList.contains("is-open")) closeSuccessModal();
        });

        form.addEventListener("submit", async event => {
            event.preventDefault();
            if (form.dataset.submitting === "true") return;

            setFormStatus("", "");
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            if (String(formData.get("honeypot") || "").trim()) return;

            const submitButton = form.querySelector("button[type='submit']");
            const submitLabel = submitButton?.dataset.submitLabel || "Request Appointment";
            const originalButtonContent = submitButton?.innerHTML || submitLabel;

            form.dataset.submitting = "true";
            form.classList.add("is-submitting");
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {
                const message = String(formData.get("message") || "").trim();
                formData.set("message", [
                    `Preferred Date: ${String(formData.get("preferredDate") || "")}`,
                    `Preferred Time: ${String(formData.get("preferredTime") || "")}`,
                    `Service Needed: ${String(formData.get("service") || "")}`,
                    `Contact Number: ${String(formData.get("phone") || "")}`,
                    "",
                    message || "No additional message provided."
                ].join("\n"));

                const response = await fetch(form.action, {
                    method: form.method || "POST",
                    headers: { "Accept": "application/json" },
                    body: formData
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "The appointment request could not be sent.");
                }

                form.reset();
                if (submitButton) submitButton.textContent = "Sent";
                openSuccessModal();
            } catch (error) {
                console.error(error);
                setFormStatus("error", "We could not send your request. Please check your connection and try again.");
                delete form.dataset.submitting;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonContent;
                }
            } finally {
                form.classList.remove("is-submitting");
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeAppointmentForm);
    } else {
        initializeAppointmentForm();
    }
})();
