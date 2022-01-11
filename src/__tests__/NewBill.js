import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import BillsUI from "../views/BillsUI.js"
import store from "../__mocks__/store"
import newBill from "../__mocks__/store"
import { func } from "../__mocks__/store"


// simulate windows alert with a jest spy
window.alert = jest.fn();

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render a New Bill form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBillForm = screen.getByTestId('form-new-bill')
      expect(newBillForm).toBeTruthy()
    })

    test("Then it should render 8 entries", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      const expenseTypeInput = screen.getByTestId('expense-type')
      expect(expenseTypeInput).toBeTruthy()

      const expenseNameInput = screen.getByTestId('expense-name')
      expect(expenseNameInput).toBeTruthy()

      const datePicker = screen.getByTestId('datepicker')
      expect(datePicker).toBeTruthy()

      const amountInput = screen.getByTestId('amount')
      expect(amountInput).toBeTruthy()

      const vatInput = screen.getByTestId('vat');
      expect(vatInput).toBeTruthy()

      const pctInput = screen.getByTestId('pct');
      expect(pctInput).toBeTruthy()

      const commentary = screen.getByTestId('commentary');
      expect(commentary).toBeTruthy()

      const fileInput = screen.getByTestId('file');
      expect(fileInput).toBeTruthy()
    })

    describe("When I add an image file as bill proof", () => {
      test("Then this new file should have been changed in the input", () => {

        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}

        const html = NewBillUI()
        document.body.innerHTML = html
        const newBills = new NewBill({document, onNavigate, localStorage: window.localStorage})
  
        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile)
        const fileInput = screen.getByTestId('file')

        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, { target: { files: [new File(['proof.jpg'], 'proof.jpg', {type: 'proof/jpg'})]}})

        expect(handleChangeFile).toHaveBeenCalled()
        expect(fileInput.files[0].name).toBe('proof.jpg') 
      })
    })

    describe("When I add an non-image file as bill proof", () => {
      test("Then throw an alert", () => {
        
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}

        const html = NewBillUI()
        document.body.innerHTML = html
        const newBills = new NewBill({document, onNavigate, localStorage: window.localStorage})

        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile)
        const fileInput = screen.getByTestId('file')
  
        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, { target: { files: [new File(['video.mp4'], 'video.mp4', {type: 'video/mp4'})]}})

        expect(handleChangeFile).toHaveBeenCalled()
        expect(window.alert).toHaveBeenCalled()
      })
    })

    describe("When I Submit form", () => {
      test("Then, I should be sent on Bills page", () => {
        
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}

        const html = NewBillUI()
        document.body.innerHTML = html
        const newBills = new NewBill({document, onNavigate, localStorage: window.localStorage})

        const handleSubmit = jest.fn((e) => newBills.handleSubmit)
        const newBillForm = screen.getByTestId('form-new-bill')

        newBillForm.addEventListener("submit", handleSubmit)
        fireEvent.submit(newBillForm)

        expect(handleSubmit).toHaveBeenCalled()
        expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
      })
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as employee", () => {
  describe("When I send a new Bill", () => {
    test("fetches bills from mock API POST", async () => {
      const getSpy = jest.spyOn(store, "post")
      const bills = await store.post(newBill)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
        await expect(func('Erreur 404')).rejects.toThrowError('Erreur 404')
      })
   
    test("fetches messages from an API and fails with 500 message error", async () => {
      await expect(func('Erreur 500')).rejects.toThrowError('Erreur 500')
    })
  })
})

