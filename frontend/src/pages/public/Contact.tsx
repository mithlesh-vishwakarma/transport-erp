export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-4">Get in touch with us for any inquiries.</p>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="mb-2"><strong>Email:</strong> support@transporterp.com</p>
        <p><strong>Phone:</strong> +1 234 567 890</p>
      </div>
    </div>
  );
}
