import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
   try {
      const stripe = Stripe(
         "pk_test_51MbORHGd3fb1GXN5BnDRNDG7GZ8iBCKOMh8oJMpMxHjOnvw95UozlfoY0tEdebwcPiaBrgqJ8EcuPAUq0ye4E7f100lfZ6e1OL"
      );
      const session = await axios.request({
         method: "GET",
         url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
      });
      console.log("stripe.bookTour:", session);
      await stripe.redirectToCheckout({
         sessionId: session.data.session.id,
      });
   } catch (err) {
      console.log(err);
      showAlert("error", err);
   }
};
