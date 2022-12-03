import React, { useEffect } from "react";
import Error from "~/components/Core/Error";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "~/config";
import { userRegister } from "~/features/authentication/userAction";
import axios from "axios";
import { WorldIDWidget } from "@worldcoin/id";

function Register() {
  const { loading, user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(config.routes.home);
    }
  }, [navigate, user]);

  const submitForm = (data) => {
    dispatch(userRegister(data));
  };

  return (
    <div>
    <form onSubmit={handleSubmit(submitForm)} className="login_form">
      <div className="materialContainer">
        <div className="box">
          <div className="title">REGISTER</div>
          <div className="input">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              required
            />
          </div>
          <div className="input">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <input
            value="email"
            type="hidden"
            name="type"
            id="type"
            {...register("type")}
          />
          {error && (
            <Error>
              {error.password
                ? error.password[0]
                : "This account is already registered"}
            </Error>
          )}
          <div className="button login">
            <button type="submit" disabled={loading}>
              <span>Register</span> <i className="fa fa-check"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
    <WorldIDWidget
      actionId="wid_staging_a34231487061ca5d0213e57051c87f77" // obtain this from developer.worldcoin.org
      signal="my_signal"
      enableTelemetry
      onSuccess={(verificationResponse) => {
        console.log(verificationResponse);
      }}
      onError={(error) => console.error(error)}
    />
    </div>
  );
}

export default Register;
